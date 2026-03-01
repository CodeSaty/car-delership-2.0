"""
Aura Drive — Pydantic Schemas
Request/response models for API validation and serialization.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date
from enum import Enum


# ── Enums ──────────────────────────────────────────────

class VehicleStatusEnum(str, Enum):
    AVAILABLE = "Available"
    SOLD = "Sold"
    IN_TRANSIT = "In-Transit"
    BOOKED = "Booked"


class VIPTierEnum(str, Enum):
    STANDARD = "Standard"
    GOLD = "Gold"
    PLATINUM = "Platinum"
    BLACK = "Black"


# ── Vehicle Schemas ────────────────────────────────────

class VehicleBase(BaseModel):
    vin: str = Field(..., max_length=17, description="Vehicle Identification Number")
    make: str = Field(..., max_length=50, description="Manufacturer (e.g., Porsche)")
    model: str = Field(..., max_length=100, description="Model name (e.g., 911 Turbo S)")
    year: int = Field(..., ge=1900, le=2030)
    purchase_price: float = Field(..., gt=0)
    status: VehicleStatusEnum = VehicleStatusEnum.AVAILABLE


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    vin: Optional[str] = Field(None, max_length=17)
    make: Optional[str] = Field(None, max_length=50)
    model: Optional[str] = Field(None, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2030)
    purchase_price: Optional[float] = Field(None, gt=0)
    status: Optional[VehicleStatusEnum] = None


class VehicleResponse(VehicleBase):
    id: int

    class Config:
        from_attributes = True


# ── Client Schemas ─────────────────────────────────────

class ClientBase(BaseModel):
    first_name: str = Field(..., max_length=50)
    last_name: str = Field(..., max_length=50)
    email: str = Field(..., max_length=120)
    phone: Optional[str] = Field(None, max_length=20)
    lifetime_value: float = Field(default=0, ge=0)
    vip_tier: VIPTierEnum = VIPTierEnum.STANDARD


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=120)
    phone: Optional[str] = Field(None, max_length=20)
    lifetime_value: Optional[float] = Field(None, ge=0)
    vip_tier: Optional[VIPTierEnum] = None


class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True


# ── Sale Schemas ───────────────────────────────────────

class SaleBase(BaseModel):
    vehicle_id: int
    client_id: int
    sale_price: float = Field(..., gt=0)
    sale_date: date
    commission: float = Field(..., ge=0)


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    client_id: Optional[int] = None
    sale_price: Optional[float] = Field(None, gt=0)
    sale_date: Optional[date] = None
    commission: Optional[float] = Field(None, ge=0)


class SaleResponse(SaleBase):
    id: int

    class Config:
        from_attributes = True


# ── Analytics Schemas ──────────────────────────────────

class QuarterlyAggregate(BaseModel):
    quarter: str
    total_units_sold: int
    total_revenue: float
    average_price: float


class InsightsResponse(BaseModel):
    max_quarter: str
    max_revenue: float
    min_quarter: str
    min_revenue: float
    quarters: list[QuarterlyAggregate]


class HealthResponse(BaseModel):
    status: str
    database: str
    total_vehicles: int
    total_clients: int
    total_sales: int
    database_size_bytes: int
    schema_tables: list[str]
