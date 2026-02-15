from fastapi import APIRouter, Depends

from app.core.database import supabase_request
from app.core.deps import AuthenticatedUser, get_current_user
from app.models.schemas import ThreadCreate, ThreadResponse

router = APIRouter(tags=["threads"])


@router.get("/threads", response_model=list[ThreadResponse])
async def list_threads(user: AuthenticatedUser = Depends(get_current_user)):
    data = await supabase_request(
        method="GET",
        path="threads",
        token=user.token,
        params={"order": "updated_at.desc"},
    )
    return data


@router.post("/threads", response_model=ThreadResponse, status_code=201)
async def create_thread(
    body: ThreadCreate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    data = await supabase_request(
        method="POST",
        path="threads",
        token=user.token,
        json={"title": body.title, "user_id": user.user_id},
    )
    return data[0]


@router.delete("/threads/{thread_id}", status_code=204)
async def delete_thread(
    thread_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    await supabase_request(
        method="DELETE",
        path=f"threads?id=eq.{thread_id}",
        token=user.token,
    )
