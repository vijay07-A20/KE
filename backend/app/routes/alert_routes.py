from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.sqlite_db import get_db
from app.models.sql_models import ClinicalAlert, AuditLog
from app.schemas.schemas import AlertResponse, AlertReviewRequest

router = APIRouter(prefix="/alerts", tags=["Clinical Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    severity: Optional[str] = Query(None, description="Filter by Critical, High, Moderate, Low"),
    is_reviewed: Optional[bool] = Query(None, description="Filter by reviewed status"),
    db: Session = Depends(get_db)
):
    query = db.query(ClinicalAlert)
    if severity:
        query = query.filter(ClinicalAlert.severity == severity)
    if is_reviewed is not None:
        query = query.filter(ClinicalAlert.is_reviewed == is_reviewed)

    # Order Critical alerts first, then created_at desc
    alerts = query.order_by(
        ClinicalAlert.is_reviewed.asc(),
        ClinicalAlert.created_at.desc()
    ).all()

    return alerts

@router.post("/{alert_id}/review", response_model=AlertResponse)
def review_alert(alert_id: int, req: AlertReviewRequest, db: Session = Depends(get_db)):
    alert = db.query(ClinicalAlert).filter(ClinicalAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.is_reviewed = True
    alert.reviewed_by = req.reviewed_by
    alert.reviewed_at = datetime.utcnow()
    alert.review_notes = req.review_notes or "Acknowledged and reviewed."

    db.add(AuditLog(
        user=req.reviewed_by,
        action="REVIEW_ALERT",
        details=f"Alert #{alert_id} ({alert.title}) reviewed by {req.reviewed_by}."
    ))

    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(ClinicalAlert).filter(ClinicalAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted"}
