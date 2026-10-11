from pydantic import BaseModel, Field
from typing import Optional

class PredictionRequest(BaseModel):
    temperature: float = Field(default=30.0, description="Temperature in Celsius")
    humidity: float = Field(default=70.0, description="Relative humidity %")
    hour: int = Field(default=18, ge=0, le=23)
    day_of_week: int = Field(default=0, ge=0, le=6)
    household_size: Optional[int] = 4

class BillingRequest(BaseModel):
    provider: str = Field(default="Adani Electricity")
    units: float = Field(default=200.0, ge=0)
