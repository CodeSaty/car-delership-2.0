"""
Aura Drive — Authentication & Role-Based Access
Multi-user system with manager and salesman roles.
"""

import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel

security = HTTPBasic()


class UserInfo(BaseModel):
    username: str
    display_name: str
    role: str  # "manager" or "salesman"


# ── User Database ──────────────────────────────
USERS: dict[str, dict] = {
    # Manager — full access
    "admin": {
        "password": "Manager@2024",
        "display_name": "Admin Manager",
        "role": "manager",
    },
    # Salesmen — restricted access
    "john.smith": {
        "password": "JSmith@123",
        "display_name": "John Smith",
        "role": "salesman",
    },
    "emma.wilson": {
        "password": "EWilson@123",
        "display_name": "Emma Wilson",
        "role": "salesman",
    },
    "david.chen": {
        "password": "DChen@123",
        "display_name": "David Chen",
        "role": "salesman",
    },
    "sarah.jones": {
        "password": "SJones@123",
        "display_name": "Sarah Jones",
        "role": "salesman",
    },
}


def verify_credentials(
    credentials: HTTPBasicCredentials = Depends(security),
) -> UserInfo:
    """
    Verify HTTP Basic credentials and return UserInfo with role.
    Raises 401 if invalid.
    """
    user = USERS.get(credentials.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    correct_password = secrets.compare_digest(
        credentials.password.encode("utf-8"),
        user["password"].encode("utf-8"),
    )
    if not correct_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    return UserInfo(
        username=credentials.username,
        display_name=user["display_name"],
        role=user["role"],
    )


def require_manager(user: UserInfo = Depends(verify_credentials)) -> UserInfo:
    """Require manager role for the endpoint."""
    if user.role != "manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager access required",
        )
    return user
