import os
from pathlib import Path
from dotenv import load_dotenv


class ModelUnavailableError(Exception):
    pass


BACKEND_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_ROOT / ".env")
DEFAULT_MODEL_PATH = BACKEND_ROOT / "models" / "mobilenetv2_traffic_sign.keras"
MODEL_UNAVAILABLE_MESSAGE = "AI recognition is not available yet. The trained model has not been integrated."


def model_path() -> Path:
    configured_path = Path(os.getenv("TRAFFIC_SIGN_MODEL_PATH", str(DEFAULT_MODEL_PATH))).expanduser()
    if configured_path.is_absolute():
        return configured_path
    return (BACKEND_ROOT.parent / configured_path).resolve()


def model_ready() -> bool:
    return model_status()[0]


def model_status() -> tuple[bool, str]:
    return False, MODEL_UNAVAILABLE_MESSAGE


def get_detector() -> None:
    _, message = model_status()
    raise ModelUnavailableError(message)
