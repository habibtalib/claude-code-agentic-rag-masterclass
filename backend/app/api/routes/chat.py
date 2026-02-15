from fastapi import APIRouter, Depends, HTTPException
from sse_starlette.sse import EventSourceResponse

from app.core.database import supabase_request
from app.core.deps import AuthenticatedUser, get_current_user
from app.models.schemas import MessageCreate
from app.services.chat import send_message_streaming

router = APIRouter(tags=["chat"])


@router.post("/threads/{thread_id}/messages")
async def send_message(
    thread_id: str,
    body: MessageCreate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    # Fetch thread to get previous_response_id (RLS ensures ownership)
    threads = await supabase_request(
        method="GET",
        path=f"threads?id=eq.{thread_id}",
        token=user.token,
    )

    if not threads:
        raise HTTPException(status_code=404, detail="Thread not found")

    thread = threads[0]

    return EventSourceResponse(
        send_message_streaming(
            message=body.content,
            thread_id=thread_id,
            previous_response_id=thread.get("openai_response_id"),
            user_token=user.token,
        )
    )
