import io
from datetime import datetime
from typing import Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def generate_patient_interaction_pdf(report_data: Dict[str, Any]) -> io.BytesIO:
    """Generates a professional clinical PDF safety report using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0c4a6e')
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#64748b')
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#0369a1'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'NormalBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>METROPOLITAN UNIVERSITY HOSPITAL</b><br/>Division of Clinical Pharmacology & Pharmacovigilance", title_style),
            Paragraph(f"<b>Report ID:</b> CDS-{datetime.utcnow().strftime('%Y%m%d%H%M')}<br/><b>Date:</b> {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}<br/><b>Status:</b> Official Clinical Report", subtitle_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 200])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=12))

    # 2. Patient Demographics Box
    patient_id = report_data.get("patientId", "N/A")
    patient_name = report_data.get("patientName", "Unknown Patient")
    age = report_data.get("patientAge", "N/A")
    overall_risk = report_data.get("overallRisk", "Safe")
    risk_summary = report_data.get("riskSummary", "No interaction detected.")

    risk_colors = {
        "Critical": colors.HexColor('#dc2626'),
        "High": colors.HexColor('#ea580c'),
        "Moderate": colors.HexColor('#d97706'),
        "Low": colors.HexColor('#2563eb'),
        "Safe": colors.HexColor('#16a34a')
    }
    banner_color = risk_colors.get(overall_risk, colors.HexColor('#64748b'))

    demo_data = [
        [
            Paragraph(f"<b>Patient Name:</b> {patient_name}", body_style),
            Paragraph(f"<b>Patient ID:</b> {patient_id}", body_style),
            Paragraph(f"<b>Age:</b> {age} yrs", body_style),
            Paragraph("<b>Confidentiality:</b> HIPAA Protected", body_style)
        ]
    ]
    demo_table = Table(demo_data, colWidths=[160, 120, 100, 160])
    demo_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(demo_table)
    story.append(Spacer(1, 10))

    # 3. Overall Risk Alert Banner
    alert_box_data = [
        [
            Paragraph(f"<b>OVERALL CLINICAL RISK ASSESSMENT: {overall_risk.upper()}</b><br/>{risk_summary}", ParagraphStyle('AlertTxt', parent=body_style, textColor=colors.white, fontName='Helvetica-Bold', fontSize=10, leading=14))
        ]
    ]
    alert_box = Table(alert_box_data, colWidths=[540])
    alert_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), banner_color),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(alert_box)
    story.append(Spacer(1, 14))

    # 4. Clinical Context (Medications, Diseases, Allergies)
    resolved = report_data.get("resolvedEntities", {})
    drugs_str = ", ".join(resolved.get("drugs", [])) or "None listed"
    diseases_str = ", ".join(resolved.get("diseases", [])) or "None documented"
    allergies_str = ", ".join(resolved.get("allergies", [])) or "No known drug allergies (NKDA)"
    history_str = ", ".join(resolved.get("medicalHistory", [])) or "Unremarkable"

    context_data = [
        [Paragraph("<b>Current Medications:</b>", bold_body), Paragraph(drugs_str, body_style)],
        [Paragraph("<b>Existing Diseases:</b>", bold_body), Paragraph(diseases_str, body_style)],
        [Paragraph("<b>Known Drug Allergies:</b>", bold_body), Paragraph(allergies_str, body_style)],
        [Paragraph("<b>Past Medical History:</b>", bold_body), Paragraph(history_str, body_style)],
    ]
    context_table = Table(context_data, colWidths=[140, 400])
    context_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#f1f5f9')),
    ]))
    story.append(Paragraph("Clinical Profile & Prescribed Regimen", h2_style))
    story.append(context_table)
    story.append(Spacer(1, 12))

    # 5. Detected Interactions & Clinical Guidance
    story.append(Paragraph("Detailed Knowledge Graph Reasoning & Detected Risks", h2_style))

    findings = report_data.get("findings", [])
    if not findings:
        story.append(Paragraph("<i>No drug interactions, contraindications, or allergy conflicts were identified in the knowledge graph for this patient profile.</i>", body_style))
    else:
        import json
        for idx, item in enumerate(findings, 1):
            if isinstance(item, str):
                try:
                    f = json.loads(item)
                except Exception:
                    f = {"title": item, "description": item, "severity": "Normal"}
            elif isinstance(item, dict):
                f = item
            else:
                f = {"title": str(item), "description": str(item), "severity": "Normal"}

            sev = f.get("severity", "Normal")
            sev_color = risk_colors.get(sev, colors.HexColor('#64748b'))
            
            finding_box = [
                [
                    Paragraph(f"<b>#{idx}. {f.get('title')}</b>", ParagraphStyle('FTitle', parent=bold_body, fontSize=10, textColor=colors.HexColor('#0f172a'))),
                    Paragraph(f"<b>Severity: {sev.upper()}</b>", ParagraphStyle('FSev', parent=bold_body, fontSize=9, textColor=sev_color, alignment=2))
                ],
                [
                    Paragraph(f"<b>Category:</b> {f.get('category')} | <b>Reasoning Path:</b> <font color='#0284c7'>{f.get('graphPath', 'N/A')}</font>", subtitle_style),
                    Paragraph("", subtitle_style)
                ],
                [
                    Paragraph(f"<b>Clinical Explanation:</b> {f.get('description')}<br/>"
                              f"<b>Mechanism:</b> {f.get('mechanism')}<br/>"
                              f"<b>Expected Clinical Effect:</b> <font color='#b91c1c'>{f.get('clinicalEffect')}</font><br/>"
                              f"<b>Recommended Action:</b> <b>{f.get('recommendedAction')}</b><br/>"
                              f"<b>Evidence Source:</b> <i>{f.get('evidenceSource')}</i>", body_style),
                    Paragraph("", body_style)
                ]
            ]
            
            fb_table = Table(finding_box, colWidths=[420, 120])
            fb_table.setStyle(TableStyle([
                ('SPAN', (0, 1), (1, 1)),
                ('SPAN', (0, 2), (1, 2)),
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ffffff')),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                ('LINELEFT', (0,0), (0,-1), 4, sev_color),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 8),
                ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(fb_table)
            story.append(Spacer(1, 8))

    story.append(Spacer(1, 14))

    # 6. Disclaimer & Signatures
    disclaimer_text = (
        "<b>ACADEMIC CLINICAL DECISION SUPPORT DISCLAIMER:</b> This report is generated by a knowledge graph-based "
        "inference system for informational and clinical decision-support purposes only. It is NOT a certified medical device "
        "and MUST NEVER replace the independent clinical judgment of a licensed physician or pharmacist. Absence of detected "
        "interactions does not guarantee pharmacological compatibility. All recommendations must be verified against current formulary."
    )
    story.append(Paragraph(disclaimer_text, ParagraphStyle('Disc', parent=body_style, fontSize=7, leading=9, textColor=colors.HexColor('#64748b'))))
    story.append(Spacer(1, 18))

    sig_data = [
        [
            Paragraph("____________________________________________<br/><b>Attending Physician Signature & License #</b>", body_style),
            Paragraph("____________________________________________<br/><b>Lead Pharmacist Review & Timestamp</b>", body_style)
        ]
    ]
    sig_table = Table(sig_data, colWidths=[270, 270])
    story.append(sig_table)

    doc.build(story)
    buffer.seek(0)
    return buffer
