from src.db.get_session import get_async_session
from src.app.auth.token.jwt_token import jwt_token
from src.app.auth.token.schemas import TokenSchemas

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, status, HTTPException, Cookie, Depends

jwt_router = APIRouter(prefix="/auth/jwt", tags=["jwt"])


@jwt_router.post("/refresh", response_model_exclude_none=True)
async def refresh(
        refresh_token: str | None = Cookie(default=None),
        session: AsyncSession = Depends(get_async_session)
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизован")

    access_token = await jwt_token.refresh(refresh_token=refresh_token, session=session)
    return TokenSchemas(access_token=access_token)
