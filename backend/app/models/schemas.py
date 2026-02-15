from datetime import datetime

from pydantic import BaseModel


class ThreadCreate(BaseModel):
    title: str = "New Thread"


class ThreadResponse(BaseModel):
    id: str
    user_id: str
    title: str
    openai_response_id: str | None = None
    created_at: datetime
    updated_at: datetime


class MessageCreate(BaseModel):
    content: str
