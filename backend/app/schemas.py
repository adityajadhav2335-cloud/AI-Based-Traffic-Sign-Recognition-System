from typing import Literal

from pydantic import BaseModel, Field


class Explanation(BaseModel):
    meaning: str
    purpose: str
    recommended_driver_action: str


class Prediction(BaseModel):
    class_id: int = Field(ge=0)
    label: str
    category: Literal["Mandatory", "Cautionary", "Informatory"]
    confidence: float = Field(ge=0, le=1)
    explanation: Explanation


class ModelInfo(BaseModel):
    name: str
    version: str


class AnalyzeResponse(BaseModel):
    status: Literal["ok"]
    model: ModelInfo
    prediction: Prediction
