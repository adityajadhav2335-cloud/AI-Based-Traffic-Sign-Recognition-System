# AI-Based Traffic Sign Recognition System

A college demonstration project for Indian traffic signs. The current application has a React + Vite frontend and a FastAPI backend. It demonstrates image selection, preview, upload, server-side validation, API status, and a separately labelled illustrative Stop-sign reference.

## Current features

- Responsive recognition page and searchable sign-library page.
- JPG, PNG, and WEBP upload with a 10 MB limit, preview, remove, and drag-and-drop support.
- Frontend validation before upload; backend validates content type, image format, file size, and image dimensions.
- `GET /api/health` reports API availability and whether a trained model is ready.
- `POST /api/analyze` accepts an image and returns a clear `503` message when model weights or the future inference integration are unavailable.
- The illustrative Stop example is a separate **Illustrative Example** section, distinct from both the upload preview and analysis result. It is labelled **DEMO OUTPUT — ILLUSTRATIVE EXAMPLE, NOT A REAL MODEL PREDICTION** and has no confidence score.
- The hero image is stored locally, so the page does not depend on a remote stock-photo URL.

## Current limitations

- There is no dataset, class map, training pipeline, trained model, or real image prediction in this repository.
- Uploading an image demonstrates the API workflow and validation. It does not recognize the sign yet; the expected response is `503` until a real model is trained and integrated.
- The sign library and `backend/app/sign_info.json` are reference content. They are not a trained class map, and their categories and descriptions need review against the chosen Indian dataset and authoritative road-sign references before model integration.
- No TensorFlow, Keras, OpenCV, PyTorch, or Ultralytics package is needed for the current demonstration. `backend/requirements-model.txt` is intentionally only a note for the future ML stage.

## Future machine-learning approach

The planned model is a TensorFlow/Keras MobileNetV2 image classifier using transfer learning. The work still required is:

1. Select and obtain a suitable Indian traffic-sign dataset with terms that allow the intended use.
2. Inspect labels and class balance; define the class IDs and verified information JSON.
3. Prepare single-sign images, split by source scene/sign into train, validation, and test sets, and keep preprocessing identical in training and prediction.
4. Train and evaluate MobileNetV2, save the model and class map, then implement the real FastAPI inference adapter.
5. Connect the API response to the React result view and report measured evaluation results.

The backend response schema is shaped for single-image classification (`class_id`, `label`, one category, confidence, and an explanation). This schema is not evidence that an inference model exists.

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

Expected health response before model training:

```json
{
  "status": "ok",
  "model_ready": false,
  "message": "AI recognition is not available yet. The trained model has not been integrated."
}
```

## Demonstration flow

1. Start both services and open the Vite URL.
2. Select a JPG, PNG, or WEBP image under 10 MB. The preview appears and the file is sent to FastAPI.
3. With no trained model installed, the API returns `503`; the UI displays the backend's explanation. This is the expected honest result.
4. Select **Show Illustrative Example** to display a fixed Stop-sign reference in its own section. It does not use the uploaded image or call the model.
5. To capture screenshots, take one of the main page after loading it, one of the selected-image preview, one of the `503` model-unavailable message, and one of the labelled illustrative output. Optionally capture `/api/health` or FastAPI `/docs` in a browser tab as an API screenshot.

The illustrative Stop-sign meaning and driver action follow Rule 7 of India's Rules of the Road Regulations, 2017. The purpose sentence is a plain-language explanation of that right-of-way function. [Gazette text](https://cdnbbsr.s3waas.gov.in/s3250413d2982f1f83aa62a3a323cd2a87/uploads/2025/06/202506111103541471.pdf)

## Useful checks

```powershell
npm.cmd run build
npm.cmd run lint
```

The project does not include a test suite. API behavior can be checked through `/api/health`, the `/api/analyze` form in `/docs`, and the frontend upload flow.

Do not commit datasets, trained checkpoints, or user-uploaded images.
