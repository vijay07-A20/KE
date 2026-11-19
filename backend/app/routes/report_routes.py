import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.sqlite_db import get_db
from app.models.sql_models import InteractionReport, AuditLog
from app.schemas.schemas import ReportCreateRequest, ReportResponse
from app.services.pdf_generator import generate_patient_interaction_pdf

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/generate", response_model=ReportResponse)
def create_report(req: ReportCreateRequest, db: Session = Depends(get_db)):
    analysis = req.analysisResult
    overall_risk = analysis.get("overallRisk", "Normal")
    summary = analysis.get("riskSummary", "Clinical interaction check completed.")

    report = InteractionReport(
        patient_id=req.patientId,
        patient_name=req.patientName,
        overall_risk=overall_risk,
        summary=summary,
        report_data_json=json.dumps(analysis),
        generated_by=req.generatedBy or "Attending Physician"
    )
    db.add(report)
    db.add(AuditLog(
        user=req.generatedBy or "Physician",
        action="GENERATE_REPORT",
        details=f"Generated clinical report for patient {req.patientName} ({req.patientId}). Risk: {overall_risk}."
    ))
    db.commit()
    db.refresh(report)

    return ReportResponse(
        id=report.id,
        patient_id=report.patient_id,
        patient_name=report.patient_name,
        overall_risk=report.overall_risk,
        summary=report.summary,
        report_data=json.loads(report.report_data_json),
        generated_by=report.generated_by,
        created_at=report.created_at
    )

@router.get("", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(InteractionReport).order_by(InteractionReport.created_at.desc()).all()
    res = []
    for r in reports:
        try:
            data = json.loads(r.report_data_json)
        except Exception:
            data = {}
        res.append(ReportResponse(
            id=r.id,
            patient_id=r.patient_id,
            patient_name=r.patient_name,
            overall_risk=r.overall_risk,
            summary=r.summary,
            report_data=data,
            generated_by=r.generated_by,
            created_at=r.created_at
        ))
    return res

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(InteractionReport).filter(InteractionReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return ReportResponse(
        id=report.id,
        patient_id=report.patient_id,
        patient_name=report.patient_name,
        overall_risk=report.overall_risk,
        summary=report.summary,
        report_data=json.loads(report.report_data_json),
        generated_by=report.generated_by,
        created_at=report.created_at
    )

@router.get("/{report_id}/pdf")
def download_report_pdf(report_id: int, db: Session = Depends(get_db)):
    report = db.query(InteractionReport).filter(InteractionReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    try:
        report_data = json.loads(report.report_data_json)
    except Exception:
        report_data = {
            "patientId": report.patient_id,
            "patientName": report.patient_name,
            "overallRisk": report.overall_risk,
            "riskSummary": report.summary,
            "findings": []
        }

    pdf_stream = generate_patient_interaction_pdf(report_data)

    filename = f"CDS_Report_{report.patient_id}_{datetime.utcnow().strftime('%Y%m%d')}.pdf"
    return Response(
        content=pdf_stream.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )
