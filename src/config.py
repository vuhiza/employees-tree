from typing import Any

from pydantic import BaseSettings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine


class Settings(BaseSettings):
    db_url: str = "sqlite+aiosqlite:///./db.sqlite"
    DEBUG: bool = True
    db: AsyncEngine = None

    def __init__(self, **values: Any):
        super().__init__(**values)
        self.db = create_async_engine(self.db_url)


settings = Settings()
