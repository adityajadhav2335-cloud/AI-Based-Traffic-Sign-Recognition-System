from typing import Literal

from pydantic import BaseModel, Field


class Explanation(BaseModel):
    meaning: str
    purpose: str
    recommended_driver_action: str


class Prediction(BaseModel):
    class_id: int = Field(ge=0)
    label: str
    category: Literal["Mandatory", "Cautionary", "Prohibitory", "Regulatory", "Informatory"]
    similarity: float = Field(ge=0, le=1)
    explanation: Explanation


class MatcherInfo(BaseModel):
    name: str
    version: str


class AnalyzeResponse(BaseModel):
    status: Literal["matched", "no_match"]
    matcher: MatcherInfo
    prediction: Prediction | None = None
    message: str | None = None
