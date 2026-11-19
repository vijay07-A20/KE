import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.sqlite_db import init_db
from app.database.mongo_db import get_mongo_database, close_mongo_database
from app.routes.auth_routes import router as auth_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.patient_routes import router as patient_router
from app.routes.drug_routes import router as drug_router
from app.routes.interaction_routes import router as interaction_router
from app.routes.graph_routes import router as graph_router
from app.routes.alert_routes import router as alert_router
from app.routes.report_routes import router as report_router
from app.routes.settings_routes import router as settings_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database and Knowledge Graph
    logger.info("Starting Knowledge Graph Drug Interaction CDS backend...")
    init_db()
    try:
        mongo_database = get_mongo_database()
        if mongo_database is not None:
            logger.info("MongoDB Atlas connection verified.")
    except Exception as exc:
        logger.error("MongoDB Atlas connection failed: %s", exc)
        raise
    logger.info("Database and graph verified and ready.")
    yield
    # Shutdown
    close_mongo_database()
    logger.info("Shutting down backend...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Full-stack Knowledge Graph-Based Drug Interaction Detection and Clinical Decision Support System",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(patient_router, prefix=settings.API_PREFIX)
app.include_router(drug_router, prefix=settings.API_PREFIX)
app.include_router(interaction_router, prefix=settings.API_PREFIX)
app.include_router(graph_router, prefix=settings.API_PREFIX)
app.include_router(alert_router, prefix=settings.API_PREFIX)
app.include_router(report_router, prefix=settings.API_PREFIX)
app.include_router(settings_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "documentation": "/api/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
