"""
Aura Drive — FastAPI Application Entry Point
Luxury Auto Sales & Analytics Platform
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import vehicles, clients, sales, analytics, system


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and seed data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Aura Drive",
    description="Premium luxury auto dealership — Sales & Analytics Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(vehicles.router)
app.include_router(clients.router)
app.include_router(sales.router)
app.include_router(analytics.router)
app.include_router(system.router)


from app.auth import verify_credentials, UserInfo
from fastapi import Depends


@app.get("/", tags=["Root"])
def root():
    return {
        "name": "Aura Drive",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/api/auth/me", tags=["Auth"])
def get_current_user(user: UserInfo = Depends(verify_credentials)):
    """Return the currently authenticated user's info and role."""
    return {
        "username": user.username,
        "display_name": user.display_name,
        "role": user.role,
    }

