"""Compatibility wrapper for the temporary Pillow template matcher."""

from app.services.template_matcher import TemplateMatcher, get_template_matcher


def model_ready() -> bool:
    """The prototype matcher is available; it is not a trained model."""
    return True


def model_status() -> tuple[bool, str]:
    return True, "Template matching prototype is active; this is not a trained AI model."


def get_detector() -> TemplateMatcher:
    """Keep the existing API's detector entry point while using templates."""
    return get_template_matcher()
