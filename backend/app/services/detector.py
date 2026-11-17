import os
from pathlib import Path
from dotenv import load_dotenv


class ModelUnavailableError(Exception):
    pass


BACKEND_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_ROOT / ".env")
DEFAULT_MODEL_PATH = BACKEND_ROOT / "models" / "mobilenetv2_traffic_sign.keras"


def model_path() -> Path:
    configured_path = Path(os.getenv("TRAFFIC_SIGN_MODEL_PATH", str(DEFAULT_MODEL_PATH))).expanduser()
    if configured_path.is_absolute():
        return configured_path
    return (BACKEND_ROOT.parent / configured_path).resolve()


def model_ready() -> bool:
    return model_status()[0]


def model_status() -> tuple[bool, str]:
    weights = model_path()
    if not weights.is_file():
        return False, (
            "No trained MobileNetV2 classifier is configured. Image validation and upload are ready, "
            "but real sign recognition is unavailable until a dataset has been prepared and a model trained."
        )
    return False, (
        "A model file was found, but the MobileNetV2 inference and class-map integration is not implemented yet. "
        "No prediction will be returned."
    )


def get_detector() -> None:
    _, message = model_status()
    raise ModelUnavailableError(message)
