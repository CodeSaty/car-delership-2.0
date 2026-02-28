"""
Aura Drive — Sales Router
CRUD endpoints for vehicle sales transactions.
All authenticated users (salesman + manager) can create sales.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Sale, Vehicle, Client, VehicleStatus
from app.schemas import SaleCreate, SaleUpdate, SaleResponse
from app.auth import verify_credentials, require_manager, UserInfo

router = APIRouter(prefix="/api/sales", tags=["Sales"])


@router.get("/", response_model=List[SaleResponse])
def list_sales(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(verify_credentials),
):
    """List all sales, most recent first."""
    return (
        db.query(Sale)
        .order_by(Sale.sale_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(verify_credentials),
):
    """Get a single sale by ID."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale


@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(
    payload: SaleCreate,
    db: Session = Depends(get_db),
    user: UserInfo = Depends(verify_credentials),
):
    """Record a new sale. Any authenticated user (salesman or manager) can record sales."""
    # Validate vehicle exists
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if vehicle.status == VehicleStatus.SOLD.value:
        raise HTTPException(status_code=409, detail="Vehicle is already sold")

    # Validate client exists
    client = db.query(Client).filter(Client.id == payload.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Create sale and update vehicle status
    sale = Sale(**payload.model_dump())
    vehicle.status = VehicleStatus.SOLD.value
    client.lifetime_value = float(client.lifetime_value or 0) + payload.sale_price

    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(
    sale_id: int,
    payload: SaleUpdate,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(require_manager),
):
    """Update sale details. Manager only."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(sale, key, value)
    db.commit()
    db.refresh(sale)
    return sale


@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    _user: UserInfo = Depends(require_manager),
):
    """Remove a sale record. Manager only."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(sale)
    db.commit()
