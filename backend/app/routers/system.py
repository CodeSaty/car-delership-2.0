"""
Aura Drive — System Router
Health check and database statistics endpoint — replaces the legacy dataframe.shape / .size functions.
"""

import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import inspect

from app.database import get_db, DATABASE_URL
from app.models import Vehicle, Client, Sale
from app.schemas import HealthResponse
from app.auth import verify_credentials

router = APIRouter(prefix="/api/system", tags=["System"])


@router.get("/health", response_model=HealthResponse)
def health_check(
    db: Session = Depends(get_db),
    _user: str = Depends(verify_credentials),
):
    """
    System health and database statistics.
    Replaces legacy: dataframe.shape, dataframe.size, dataframe.columns, dataframe.dtypes
    """
    # Count records in each table
    total_vehicles = db.query(Vehicle).count()
    total_clients = db.query(Client).count()
    total_sales = db.query(Sale).count()

    # Get table names from the database
    inspector = inspect(db.bind)
    table_names = inspector.get_table_names()

    # Get database file size (SQLite)
    db_size = 0
    if "sqlite" in DATABASE_URL:
        db_path = DATABASE_URL.replace("sqlite:///", "")
        if os.path.exists(db_path):
            db_size = os.path.getsize(db_path)

    return HealthResponse(
        status="operational",
        database="SQLite" if "sqlite" in DATABASE_URL else "PostgreSQL",
        total_vehicles=total_vehicles,
        total_clients=total_clients,
        total_sales=total_sales,
        database_size_bytes=db_size,
        schema_tables=table_names,
    )
