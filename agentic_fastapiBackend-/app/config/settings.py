from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    DATABASE_URL: str = Field("sqlite+aiosqlite:///./crm.db", validation_alias="DATABASE_URL")
    DIRECT_URL: str = Field("", validation_alias="DIRECT_URL")
    DEBUG: bool = Field(False, validation_alias="DEBUG")
    SECRET_KEY: str = Field("dev-secret-key-12345", validation_alias="BETTER_AUTH_SECRET")
    BETTER_AUTH_URL: str = Field("", validation_alias="BETTER_AUTH_URL")
    API_URL: str = Field("http://localhost:3001", validation_alias="API_URL")
    APP_URL: str = Field("http://localhost:5173", validation_alias="APP_URL")
    REDIS_URL: Optional[str] = Field(None, validation_alias="REDIS_URL")
    BLOB_READ_WRITE_TOKEN: Optional[str] = Field(None, validation_alias="BLOB_READ_WRITE_TOKEN")
    AGENT_BRIDGE_SECRET: Optional[str] = Field(None, validation_alias="AGENT_BRIDGE_SECRET")
    ALLOWED_SIGN_IN: str = Field("", validation_alias="ALLOWED_SIGN_IN")
    CRON_SECRET: str = Field("", validation_alias="CRON_SECRET")
    CONTEXT_DEV_API_KEY: Optional[str] = Field(None, validation_alias="CONTEXT_DEV_API_KEY")
    PERPLEXITY_API_KEY: Optional[str] = Field(None, validation_alias="PERPLEXITY_API_KEY")
    AI_GATEWAY_API_KEY: Optional[str] = Field(None, validation_alias="AI_GATEWAY_API_KEY")
    GOOGLE_CLIENT_ID: Optional[str] = Field(None, validation_alias="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = Field(None, validation_alias="GOOGLE_CLIENT_SECRET")
    MICROSOFT_CLIENT_ID: Optional[str] = Field(None, validation_alias="MICROSOFT_CLIENT_ID")
    MICROSOFT_CLIENT_SECRET: Optional[str] = Field(None, validation_alias="MICROSOFT_CLIENT_SECRET")
    MICROSOFT_TENANT_ID: str = Field("common", validation_alias="MICROSOFT_TENANT_ID")
    IS_MARKETING: str = Field("", validation_alias="IS_MARKETING")
    AGENT_MODEL_ID: Optional[str] = Field(None, validation_alias="AGENT_MODEL_ID")
    REPORTING_CURRENCY: str = Field("USD", validation_alias="REPORTING_CURRENCY")
    ARCHIVE_RETENTION_DAYS: int = Field(180, validation_alias="ARCHIVE_RETENTION_DAYS")
    CACHE_TTL_MS: int = Field(60000, validation_alias="CACHE_TTL_MS")
    ENRICHMENT_POLL_MS: int = Field(30000, validation_alias="ENRICHMENT_POLL_MS")

settings = Settings()
