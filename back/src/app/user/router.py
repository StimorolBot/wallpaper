from fastapi import APIRouter

user_router = APIRouter(tags=["user"], prefix="/user")

@user_router.get("/{uuid_user}")
async def get_user():
    return

@user_router.post("/subscribe")
async def subscribe_user():
    return

@user_router.delete("/unsubscribe")
async def unsubscribe_user():
    return

@user_router.delete("/delete-user")
async def delete_user():
    return
