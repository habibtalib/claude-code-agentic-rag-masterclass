import json
from collections.abc import AsyncGenerator

from app.core.database import supabase_request
from app.services.openai_client import openai_client

MODEL = "gpt-4o-mini"


async def send_message_streaming(
    message: str,
    thread_id: str,
    previous_response_id: str | None,
    user_token: str,
) -> AsyncGenerator[str, None]:
    """Stream a chat response using the OpenAI Responses API.

    Yields SSE-formatted events:
    - data: {"type": "delta", "content": "..."} for text chunks
    - data: {"type": "done", "response_id": "..."} when complete
    """
    stream = openai_client.responses.create(
        model=MODEL,
        input=message,
        previous_response_id=previous_response_id,
        stream=True,
    )

    response_id = None

    for event in stream:
        if event.type == "response.output_text.delta":
            yield f"data: {json.dumps({'type': 'delta', 'content': event.delta})}\n\n"
        elif event.type == "response.completed":
            response_id = event.response.id

    # Update thread with latest response_id
    if response_id:
        await supabase_request(
            method="PATCH",
            path=f"threads?id=eq.{thread_id}",
            token=user_token,
            json={"openai_response_id": response_id},
        )

        # Generate title on first message
        if previous_response_id is None:
            await generate_thread_title(thread_id, message, user_token)

    yield f"data: {json.dumps({'type': 'done', 'response_id': response_id})}\n\n"


async def generate_thread_title(
    thread_id: str, first_message: str, user_token: str
) -> None:
    """Generate a short title for a thread based on the first message."""
    response = openai_client.responses.create(
        model=MODEL,
        input=f"Generate a short title (max 6 words) for a conversation that starts with this message. Return only the title, no quotes:\n\n{first_message}",
    )

    title = response.output_text.strip()

    await supabase_request(
        method="PATCH",
        path=f"threads?id=eq.{thread_id}",
        token=user_token,
        json={"title": title},
    )
