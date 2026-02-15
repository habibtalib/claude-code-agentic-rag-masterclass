from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str

    openai_api_key: str

    langsmith_tracing: bool = True
    langsmith_api_key: str = ""
    langsmith_project: str = "rag-masterclass"

    model_config = {"env_file": ".env"}


settings = Settings()
