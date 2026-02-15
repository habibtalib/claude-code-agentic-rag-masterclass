import os

from langsmith.wrappers import wrap_openai
from openai import OpenAI

from app.core.config import settings

# Set LangSmith env vars before creating client
os.environ["LANGSMITH_TRACING"] = str(settings.langsmith_tracing).lower()
os.environ["LANGSMITH_API_KEY"] = settings.langsmith_api_key
os.environ["LANGSMITH_PROJECT"] = settings.langsmith_project

_raw_client = OpenAI(api_key=settings.openai_api_key)
openai_client = wrap_openai(_raw_client)
