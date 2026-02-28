"""
Aura Drive — Vehicles Router
CRUD endpoints for the luxury vehicle inventory.
Manager required for create, update, delete.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Vehicle
from app.schemas import VehicleCreate, VehicleUpdate, VehicleResponse
from app.auth import verify_credentials, require_manager, UserInfo

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])


@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(
    skip: int = 0,
    limit: int = 50,
    status: str = None,
    make: str = None,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(verify_credentials),
):
    """List all vehicles with optional filtering by status or make."""
    query = db.query(Vehicle)
    if status:
        query = query.filter(Vehicle.status == status)
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(verify_credentials),
):
    """Get a single vehicle by ID."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreate,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(require_manager),
):
    """Add a new vehicle to inventory. Manager only."""
    existing = db.query(Vehicle).filter(Vehicle.vin == payload.vin).first()
    if existing:
        raise HTTPException(status_code=409, detail="Vehicle with this VIN already exists")
    vehicle = Vehicle(**payload.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(require_manager),
):
    """Update an existing vehicle. Manager only."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(require_manager),
):
    """Remove a vehicle from inventory. Manager only."""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
