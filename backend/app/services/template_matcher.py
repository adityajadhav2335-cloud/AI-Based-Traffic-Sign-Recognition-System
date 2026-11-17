"""A small, deterministic pixel-template matcher for the sign-library artwork.

This is a demonstration prototype, not a trained classifier. It is intended for
images where one sign is centered and fills most of the frame.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps, ImageStat


TEMPLATE_SIZE = 96
MIN_SIMILARITY = 0.82
MIN_WIN_MARGIN = 0.025
SIGN_INFO_PATH = Path(__file__).resolve().parents[1] / "sign_info.json"

SIGN_KEYS = (
    "stop",
    "no entry",
    "speed limit 50",
    "school ahead",
    "pedestrian crossing",
    "no parking",
    "give way",
    "no u turn",
)

BACKGROUND = "#f4f6f2"
RED = "#c84b43"
BLUE = "#3973bc"
YELLOW = "#e3a64d"
DARK = "#34443b"
WHITE = "#ffffff"


def _polygon_points(cx: float, cy: float, radius: float, sides: int, rotation: float = -90) -> list[tuple[float, float]]:
    import math

    return [
        (
            cx + radius * math.cos(math.radians(rotation + index * 360 / sides)),
            cy + radius * math.sin(math.radians(rotation + index * 360 / sides)),
        )
        for index in range(sides)
    ]


def _new_template() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (TEMPLATE_SIZE, TEMPLATE_SIZE), BACKGROUND)
    return image, ImageDraw.Draw(image)


def _draw_stop() -> Image.Image:
    image, draw = _new_template()
    draw.polygon(_polygon_points(48, 46, 33, 8, -67.5), fill=RED)
    draw.polygon(_polygon_points(48, 46, 28, 8, -67.5), fill="#faf6e9")
    draw.text((27, 41), "STOP", fill=RED, font=ImageFont.load_default())
    return image


def _draw_no_entry() -> Image.Image:
    image, draw = _new_template()
    draw.ellipse((15, 13, 81, 79), fill=RED)
    draw.ellipse((21, 19, 75, 73), fill=WHITE)
    draw.rectangle((18, 40, 78, 52), fill=RED)
    return image


def _draw_speed_limit() -> Image.Image:
    image, draw = _new_template()
    draw.ellipse((14, 12, 82, 80), fill=RED)
    draw.ellipse((20, 18, 76, 74), fill=WHITE)
    draw.text((34, 39), "50", fill=DARK, font=ImageFont.load_default())
    return image


def _draw_school() -> Image.Image:
    image, draw = _new_template()
    draw.polygon(_polygon_points(48, 46, 34, 4, 45), fill=YELLOW, outline=WHITE, width=2)
    # Simple child-crossing silhouettes echo the existing school-ahead icon.
    draw.ellipse((36, 32, 42, 38), fill=WHITE)
    draw.ellipse((53, 32, 59, 38), fill=WHITE)
    draw.line((39, 39, 39, 53, 34, 61), fill=WHITE, width=4)
    draw.line((39, 45, 32, 50), fill=WHITE, width=3)
    draw.line((39, 45, 46, 50), fill=WHITE, width=3)
    draw.line((39, 53, 44, 62), fill=WHITE, width=3)
    draw.line((56, 39, 56, 53, 61, 61), fill=WHITE, width=4)
    draw.line((56, 45, 50, 50), fill=WHITE, width=3)
    draw.line((56, 45, 63, 50), fill=WHITE, width=3)
    return image


def _draw_pedestrian_crossing() -> Image.Image:
    image, draw = _new_template()
    draw.rectangle((17, 16, 79, 76), fill="#3b70b9", outline=WHITE, width=3)
    draw.ellipse((43, 25, 52, 34), fill=WHITE)
    draw.line((47, 34, 47, 51, 39, 62), fill=WHITE, width=5)
    draw.line((47, 40, 37, 46), fill=WHITE, width=4)
    draw.line((47, 40, 57, 47), fill=WHITE, width=4)
    draw.line((47, 51, 57, 64), fill=WHITE, width=4)
    draw.line((24, 66, 72, 66), fill=WHITE, width=3)
    return image


def _draw_no_parking() -> Image.Image:
    image, draw = _new_template()
    draw.ellipse((16, 14, 80, 78), fill=BLUE)
    draw.ellipse((22, 20, 74, 72), fill=WHITE)
    draw.text((39, 34), "P", fill=BLUE, font=ImageFont.load_default())
    draw.line((22, 70, 74, 22), fill=RED, width=6)
    return image


def _draw_give_way() -> Image.Image:
    image, draw = _new_template()
    draw.polygon(_polygon_points(48, 49, 37, 3, 90), fill=RED)
    draw.polygon(_polygon_points(48, 47, 29, 3, 90), fill=WHITE)
    return image


def _draw_no_u_turn() -> Image.Image:
    image, draw = _new_template()
    draw.ellipse((16, 14, 80, 78), fill=RED)
    draw.ellipse((22, 20, 74, 72), fill=WHITE)
    # Draw an upward-and-left U-turn arrow, then the red prohibition stroke.
    draw.line((57, 57, 57, 42, 49, 34, 38, 34, 38, 43), fill=DARK, width=5)
    draw.polygon([(31, 42), (38, 51), (45, 42)], fill=DARK)
    draw.line((25, 68, 71, 23), fill=RED, width=5)
    return image


TEMPLATE_BUILDERS = (
    _draw_stop,
    _draw_no_entry,
    _draw_speed_limit,
    _draw_school,
    _draw_pedestrian_crossing,
    _draw_no_parking,
    _draw_give_way,
    _draw_no_u_turn,
)


class TemplateMatcher:
    name = "Pillow sign-library template matcher"
    version = "prototype"

    def __init__(self) -> None:
        with SIGN_INFO_PATH.open(encoding="utf-8") as info_file:
            self.sign_info: dict[str, dict[str, Any]] = json.load(info_file)
        self.templates = tuple(builder() for builder in TEMPLATE_BUILDERS)

    @staticmethod
    def _normalize(image: Image.Image) -> Image.Image:
        return ImageOps.fit(
            image.convert("RGB"),
            (TEMPLATE_SIZE, TEMPLATE_SIZE),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )

    @staticmethod
    def _pixel_similarity(first: Image.Image, second: Image.Image) -> float:
        difference = ImageChops.difference(first, second)
        mean_difference = sum(ImageStat.Stat(difference).mean) / 3
        return 1.0 - mean_difference / 255.0

    def predict(self, image: Image.Image) -> dict[str, Any] | None:
        normalized = self._normalize(image)
        scores = [self._pixel_similarity(normalized, template) for template in self.templates]
        ranked_indices = sorted(range(len(scores)), key=scores.__getitem__, reverse=True)
        best_index, second_index = ranked_indices[:2]
        best_similarity = scores[best_index]
        if best_similarity < MIN_SIMILARITY or best_similarity - scores[second_index] < MIN_WIN_MARGIN:
            return None

        key = SIGN_KEYS[best_index]
        info = self.sign_info.get(key)
        if info is None:
            raise RuntimeError(f"No sign information is configured for template class: {key}")

        return {
            "class_id": best_index,
            "label": info["label"],
            "category": info["category"],
            "similarity": round(best_similarity, 4),
            "explanation": {
                "meaning": info["meaning"],
                "purpose": info["purpose"],
                "recommended_driver_action": info["action"],
            },
        }


_matcher: TemplateMatcher | None = None


def get_template_matcher() -> TemplateMatcher:
    global _matcher
    if _matcher is None:
        _matcher = TemplateMatcher()
    return _matcher
