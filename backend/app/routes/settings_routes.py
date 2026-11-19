from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database.sqlite_db import get_db, init_db
from app.knowledge_graph.graph_engine import graph_engine
from app.knowledge_graph.neo4j_client import neo4j_client
from app.models.sql_models import AuditLog, PatientRecord, ClinicalAlert, InteractionReport

router = APIRouter(prefix="/settings", tags=["Settings & Administration"])

@router.get("/status")
def get_system_status():
    graph_stats = graph_engine.get_graph_stats()
    return {
        "appName": settings.APP_NAME,
        "appVersion": settings.APP_VERSION,
        "database": "SQLite (hospital_cds.db)",
        "graphEngine": "NetworkX + Neo4j Dual Engine",
        "neo4j": {
            "uri": settings.NEO4J_URI,
            "connected": neo4j_client.is_connected(),
            "user": settings.NEO4J_USER
        },
        "stats": graph_stats
    }

@router.post("/test-neo4j")
def test_neo4j_connection(payload: dict = None):
    uri = payload.get("uri") if payload else settings.NEO4J_URI
    user = payload.get("user") if payload else settings.NEO4J_USER
    password = payload.get("password") if payload else settings.NEO4J_PASSWORD

    from neo4j import GraphDatabase
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password), connection_timeout=3.0)
        driver.verify_connectivity()
        driver.close()
        return {"success": True, "message": f"Successfully verified connection to Neo4j at {uri}"}
    except Exception as e:
        return {"success": False, "message": f"Could not connect to Neo4j: {str(e)}"}

@router.post("/reset-demo")
def reset_demo_data(db: Session = Depends(get_db)):
    """Resets patient records and clinical alerts to default medically verified state."""
    db.query(ClinicalAlert).delete()
    db.query(InteractionReport).delete()
    db.query(PatientRecord).delete()
    db.commit()

    init_db()
    graph_engine._initialize_graph()

    return {"success": True, "message": "Demo database and knowledge graph successfully reset."}

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "user": l.user,
            "action": l.action,
            "details": l.details,
            "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        for l in logs
    ]
