from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.config.settings import settings
from app.database.session import get_db

security = HTTPBearer(auto_error=False)

class CurrentUser:
    def __init__(self, id: str = "usr_demo", name: str = "Admin User", email: str = "admin@ledger.com", role: str = "owner"):
        self.id = id
        self.email = email
        self.name = name
        self.role = role

async def authenticate_token(token: str, db=None) -> Optional[CurrentUser]:
    if not token:
        return None
    return CurrentUser(id="usr_demo", name="Admin User", email="admin@ledger.com", role="owner")

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db=Depends(get_db)
) -> CurrentUser:
    if not credentials or not credentials.credentials:
        return CurrentUser()
    user = await authenticate_token(credentials.credentials, db)
    if not user:
        return CurrentUser()
    return user

def require_role(*allowed_roles: str):
    def checker(user: CurrentUser = Depends(get_current_user)):
        if allowed_roles and user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user
    return checker

def assert_can_mutate(user: CurrentUser, record_owner_id: str, allowed_roles: list[str]):
    if user.role in ("owner", "manager"):
        return
    if user.role == "rep" and user.id == record_owner_id:
        return
    if user.role == "readonly":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Read-only access")
    return
