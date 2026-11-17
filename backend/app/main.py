from io import BytesIO
from typing import Annotated

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

from app.schemas import AnalyzeResponse
from app.services.detector import (
    get_detector,
    model_status,
)

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}

app = FastAPI(
    title="AI-Based Traffic Sign Recognition System API",
    version="0.1.0",
    description="Validates uploaded images and compares them with sign-library templates. This is not a trained AI model.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str | bool]:
    matcher_ready, message = model_status()
    return {
        "status": "ok",
        "matcher_ready": matcher_ready,
        "recognition_mode": "template_matching_prototype",
        "message": message,
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_image(file: Annotated[UploadFile, File(description="JPG, PNG, or WEBP image")]):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Choose a JPG, PNG, or WEBP image.")

    contents = await file.read(MAX_FILE_SIZE + 1)
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="The image is larger than 10 MB.")

    try:
        image = Image.open(BytesIO(contents))
        if image.format not in ALLOWED_FORMATS:
            raise HTTPException(status_code=415, detail="Choose a JPG, PNG, or WEBP image.")
        if image.width * image.height > 40_000_000:
            raise HTTPException(status_code=413, detail="The image dimensions are too large to analyze.")
        image.verify()
        image = Image.open(BytesIO(contents)).convert("RGB")
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="The uploaded file is not a readable image.") from exc
    finally:
        await file.close()

    try:
        detector = await run_in_threadpool(get_detector)
        prediction = await run_in_threadpool(detector.predict, image)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    matcher = {"name": detector.name, "version": detector.version}
    if prediction is None:
        return {
            "status": "no_match",
            "matcher": matcher,
            "prediction": None,
            "message": "No reliable match found",
        }

    return {"status": "matched", "matcher": matcher, "prediction": prediction}
