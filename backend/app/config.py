import os

class Settings:
    APP_NAME: str = "Knowledge Graph Drug Interaction CDS"
    APP_VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Neo4j Settings
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "")
    
    # SQLite Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hospital_cds.db")

settings = Settings()
