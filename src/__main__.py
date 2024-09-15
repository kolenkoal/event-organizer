import uvicorn

from src.app import create_app
from src.config.server import ServerSettings

if __name__ == "__main__":
    uvicorn.run(create_app, factory=True, **ServerSettings().model_dump())
