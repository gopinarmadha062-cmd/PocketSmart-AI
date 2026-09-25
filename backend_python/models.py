"""
Pydantic Schemas and Data Models for PocketSmart AI
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    password: str


class LoginUser(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserInDB(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False


# Home Planner Inputs
class HomeBudgetInput(BaseModel):
    total_budget: float = Field(..., gt=0, description="Total budget in INR")
    num_lights: int = Field(default=0, ge=0)
    num_fans: int = Field(default=0, ge=0)
    num_furniture: int = Field(default=0, ge=0)
    num_dining_tables: int = Field(default=0, ge=0)
    has_living_room: bool = True
    has_kitchen: bool = True
    has_bedroom: bool = True
    additional_requirements: Optional[str] = None


# Party Planner Inputs
class PartyBudgetInput(BaseModel):
    total_budget: float = Field(..., gt=0, description="Total budget in INR")
    num_guests: int = Field(..., gt=0)
    party_type: str
    venue_type: Optional[str] = "Home"
    needs_catering: bool = True
    needs_decoration: bool = True
    needs_entertainment: bool = True
    needs_photography: bool = False
    additional_requirements: Optional[str] = None


# Jewelry Planner Inputs
class JewelryBudgetInput(BaseModel):
    total_budget: float = Field(..., gt=0, description="Total budget in INR")
    occasion: str
    preferences: Optional[str] = "Minimalist"
    image_path: Optional[str] = None


# Recommendation Record
class UserRecommendationRecord(BaseModel):
    id: str
    username: str
    timestamp: str
    recommendation_type: str
    input_summary: Dict[str, Any]
    result_summary: Dict[str, Any]
    full_result: Dict[str, Any]
