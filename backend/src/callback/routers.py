
from fastapi import APIRouter, Depends, HTTPException
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from starlette.responses import RedirectResponse

router = APIRouter()

CLIENT_SECRETS_FILE = "client_secret.json"  # Скачайте этот файл из Google API Console
SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
REDIRECT_URI = "https://events.auditory.ru/callback"

flow = Flow.from_client_secrets_file(
    CLIENT_SECRETS_FILE,
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI,
)


@router.get("/google-auth")
def google_auth():
    authorization_url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true")
    return RedirectResponse(url=authorization_url)


@router.get("/callback")
def google_auth_callback(code: str):
    try:
        flow.fetch_token(code=code)
        credentials = flow.credentials
        build("calendar", "v3", credentials=credentials)
        return {"message": "Авторизация успешна"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка авторизации: {e}")


@router.post("/add-to-calendar")
def add_event_to_calendar(event_id: str, user_credentials=Depends(google_auth_callback)):
    try:
        event_data = {
            "summary": "Название мероприятия",
            "location": "Адрес",
            "description": "Описание",
            "start": {"dateTime": "2025-01-15T10:00:00+03:00"},
            "end": {"dateTime": "2025-01-15T12:00:00+03:00"},
        }
        service = build("calendar", "v3", credentials=user_credentials)
        event = service.events().insert(calendarId="primary", body=event_data).execute()
        return {"message": "Событие добавлено", "eventLink": event.get("htmlLink")}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка добавления события: {e}")
