from typing import Any
import os.path
from pydantic import BaseSettings, validator, PostgresDsn
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine


class Settings(BaseSettings):
    DEFAULT_DATABASE_HOSTNAME: str
    DEFAULT_DATABASE_USER: str
    DEFAULT_DATABASE_PASSWORD: str
    DEFAULT_DATABASE_PORT: str
    DEFAULT_DATABASE_DB: str
    DEFAULT_SQLALCHEMY_DATABASE_URI: str = ""

    db: AsyncEngine = None

    @validator("DEFAULT_SQLALCHEMY_DATABASE_URI")
    def _assemble_default_db_connection(cls, v: str, values: dict[str, str]) -> str:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            user=values["DEFAULT_DATABASE_USER"],
            password=values["DEFAULT_DATABASE_PASSWORD"],
            host=values["DEFAULT_DATABASE_HOSTNAME"],
            port=values["DEFAULT_DATABASE_PORT"],
            path=f"/{values['DEFAULT_DATABASE_DB']}",
        )

    class Config:
        env_file = "../.env" if os.path.exists("../.env") else "./.env"
        case_sensitive = True

    def __init__(self, **values: Any):
        super().__init__(**values)
        self.db = create_async_engine(self.DEFAULT_SQLALCHEMY_DATABASE_URI, pool_size=20, max_overflow=40)


settings = Settings()
