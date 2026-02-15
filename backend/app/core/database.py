import httpx

from app.core.config import settings


async def supabase_request(
    method: str,
    path: str,
    token: str,
    json: dict | None = None,
    params: dict | None = None,
) -> dict | list:
    """Make an authenticated request to Supabase PostgREST.

    Uses the user's JWT so RLS policies are enforced.
    """
    url = f"{settings.supabase_url}/rest/v1/{path}"
    headers = {
        "apikey": settings.supabase_anon_key,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=url,
            headers=headers,
            json=json,
            params=params,
        )
        response.raise_for_status()

        if response.status_code == 204:
            return {}
        return response.json()
