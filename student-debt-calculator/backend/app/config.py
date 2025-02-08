from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Base configuration
    APP_NAME: str = "Student Debt Calculator API"
    DEBUG: bool = False
    
    # CORS configuration
    CORS_ORIGINS: list = ["*"]  # In production, replace with specific origins
    CORS_HEADERS: list = ["*"]
    
    # Data file paths - update these for production
    SCHOOLS_DATA_PATH: str = "data/Most-Recent-Cohorts-Institution.csv"
    PROGRAMS_DATA_PATH: str = "data/Most-Recent-Cohorts-Field-of-Study.csv"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
