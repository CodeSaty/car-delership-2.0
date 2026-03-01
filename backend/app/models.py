"""
Aura Drive — SQLAlchemy ORM Models
Defines the Vehicles, Clients, and Sales tables for the luxury auto dealership.
"""

import enum
from sqlalchemy import (
    Column, Integer, String, Numeric, Date, ForeignKey, Enum, DateTime, func
)
from sqlalchemy.orm import relationship
from app.database import Base


class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    SOLD = "Sold"
    IN_TRANSIT = "In-Transit"
    BOOKED = "Booked"


class VIPTier(str, enum.Enum):
    STANDARD = "Standard"
    GOLD = "Gold"
    PLATINUM = "Platinum"
    BLACK = "Black"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vin = Column(String(17), unique=True, nullable=False, index=True)
    make = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    purchase_price = Column(Numeric(12, 2), nullable=False)
    status = Column(String(20), default=VehicleStatus.AVAILABLE.value, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    sales = relationship("Sale", back_populates="vehicle")

    def __repr__(self):
        return f"<Vehicle {self.year} {self.make} {self.model} ({self.vin})>"


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    lifetime_value = Column(Numeric(14, 2), default=0)
    vip_tier = Column(String(20), default=VIPTier.STANDARD.value, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    sales = relationship("Sale", back_populates="client")

    def __repr__(self):
        return f"<Client {self.first_name} {self.last_name} ({self.vip_tier})>"


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    sale_price = Column(Numeric(12, 2), nullable=False)
    sale_date = Column(Date, nullable=False)
    commission = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    vehicle = relationship("Vehicle", back_populates="sales")
    client = relationship("Client", back_populates="sales")

    def __repr__(self):
        return f"<Sale #{self.id} — ${self.sale_price} on {self.sale_date}>"
