# AI-Based Traffic Sign Recognition System

A college demonstration project for Indian traffic signs. The application has a React + Vite frontend and a FastAPI backend. It includes image selection and preview, server-side validation, an eight-class sign library, a temporary Pillow-based template matcher, and a separately labelled illustrative Stop-sign reference.

## Current features

- Responsive recognition page and searchable sign-library page.
- JPG, PNG, and WEBP upload with a 10 MB limit, preview, remove, and drag-and-drop support.
- Frontend validation before upload; backend validates content type, image format, file size, and image dimensions.
- `GET /api/health` reports API availability and that the template-matching prototype is active.
- `POST /api/analyze` accepts an image, compares it with eight Pillow-rendered templates based on the sign-library designs, and returns matching sign information from `backend/app/sign_info.json` when a template passes the similarity threshold.
- A non-match is reported as **No reliable match found**. The UI does not show a confidence percentage.
- The illustrative Stop example is a separate **Illustrative Example** section, distinct from both the upload preview and analysis result. It is labelled **DEMO OUTPUT — ILLUSTRATIVE EXAMPLE, NOT A REAL MODEL PREDICTION** and has no confidence score.
- The hero image is stored locally, so the page does not depend on a remote stock-photo URL.

## Current limitations

- **This is template matching, not a trained AI model.** The eight reference images are generated with Pillow from simplified shapes and colors inspired by the React/CSS sign-library artwork.
- The matcher center-crops and resizes the upload, then compares RGB pixels. It requires a best pixel similarity of at least `0.82` and a lead of at least `0.025` over the runner-up template. These are hand-set prototype thresholds, not calibrated performance measures.
- It is intended only for a single, centered sign that fills most of the image and resembles the simplified library artwork.
- It does not locate signs in a road scene, handle multiple signs, reliably compensate for perspective, rotation, blur, shadows, weather, occlusion, or varied real sign artwork, or provide a measured accuracy. A template match is not evidence of general Indian-road sign recognition.
- The repository still has no labeled image dataset, training pipeline, or trained model. Do not use prototype matches as safety-critical advice.
- No TensorFlow, Keras, OpenCV, PyTorch, or Ultralytics package is needed. The matcher uses Pillow already listed in `backend/requirements.txt`. `backend/requirements-model.txt` remains a note for a future trained-model stage.

## Future machine-learning approach

The future trained model may be a TensorFlow/Keras MobileNetV2 image classifier using transfer learning. The work still required is:

1. Select and obtain a suitable Indian traffic-sign dataset with terms that allow the intended use.
2. Inspect labels and class balance; define the class IDs and verified information JSON.
3. Prepare single-sign images, split by source scene/sign into train, validation, and test sets, and keep preprocessing identical in training and prediction.
4. Train and evaluate MobileNetV2, save the model and class map, then implement the real FastAPI inference adapter.
5. Connect the API response to the React result view and report measured evaluation results.

The current `/api/analyze` response identifies its matcher as a prototype and carries the pixel-template similarity separately from any confidence estimate. Similarity is only a comparison score; no accuracy or confidence claim is made.

## Run on Windows PowerShell

Open two terminals in this project folder. The checked-in frontend dependencies and backend virtual environment are already present in this workspace. If setting up on another computer, install the lightweight dependencies listed in `package.json` and `backend/requirements.txt` first; do not install ML packages for this demo.

### Terminal 1: FastAPI

```powershell
.\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

### Terminal 2: React + Vite

```powershell
npm.cmd run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. FastAPI docs are at `http://localhost:8000/docs`; health is at `http://localhost:8000/api/health`.

Expected health response while the template matcher is active:

```json
{
  "status": "ok",
  "matcher_ready": true,
  "recognition_mode": "template_matching_prototype",
  "message": "Template matching prototype is active; this is not a trained AI model."
}
```

## Demonstration flow

1. Start both services and open the Vite URL.
2. Select a JPG, PNG, or WEBP image under 10 MB. The preview appears and the file is sent to FastAPI.
3. The API compares the center-cropped image against the eight sign templates. It returns sign information only for a match above the threshold; otherwise the UI displays **No reliable match found**.
4. Select **Show Illustrative Example** to display a fixed Stop-sign reference in its own section. It does not use the uploaded image or participate in template matching.
5. To capture screenshots, take one of the main page after loading it, one of a selected-image preview, one of a template match or the no-match response, and one of the labelled illustrative output. Optionally capture `/api/health` or FastAPI `/docs` in a browser tab as an API screenshot.

The illustrative Stop-sign meaning and driver action follow Rule 7 of India's Rules of the Road Regulations, 2017. The purpose sentence is a plain-language explanation of that right-of-way function. [Gazette text](https://cdnbbsr.s3waas.gov.in/s3250413d2982f1f83aa62a3a323cd2a87/uploads/2025/06/202506111103541471.pdf)

## Useful checks

```powershell
npm.cmd run build
npm.cmd run lint
```

The project does not include a test suite. API behavior can be checked through `/api/health`, the `/api/analyze` form in `/docs`, and the frontend upload flow.

Do not commit datasets, trained checkpoints, or user-uploaded images.
