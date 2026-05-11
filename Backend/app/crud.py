from sqlalchemy.orm import Session
from sqlalchemy import or_
from .models import Participant

def get_participants(db: Session, search: str | None = None):
    query = db.query(Participant)
    if search:
        like = f"%{search.strip()}%"
        query = query.filter(Participant.name.ilike(like))
    return query.order_by(Participant.name.asc()).all()

def get_participant(db: Session, participant_id: int):
    return db.query(Participant).filter(Participant.id == participant_id).first()

def update_mic(db: Session, participant: Participant, enabled: bool):
    participant.mic_enabled = enabled
    db.commit()
    db.refresh(participant)
    return participant

def update_camera(db: Session, participant: Participant, enabled: bool):
    participant.camera_enabled = enabled
    db.commit()
    db.refresh(participant)
    return participant

def update_presence(db: Session, participant: Participant, is_online: bool):
    participant.is_online = is_online
    db.commit()
    db.refresh(participant)
    return participant