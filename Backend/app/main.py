from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Participants API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/participants", response_model=list[schemas.ParticipantResponse])
def list_participants(
    search: str | None = Query(default=None, min_length=1),
    db: Session = Depends(get_db)
):
    return crud.get_participants(db, search=search)

@app.get("/participants/{participant_id}", response_model=schemas.ParticipantResponse)
def get_participant(participant_id: int, db: Session = Depends(get_db)):
    participant = crud.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant

@app.patch("/participants/{participant_id}/mic", response_model=schemas.ParticipantResponse)
def patch_mic(participant_id: int, payload: schemas.MediaStateUpdate, db: Session = Depends(get_db)):
    participant = crud.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return crud.update_mic(db, participant, payload.enabled)

@app.patch("/participants/{participant_id}/camera", response_model=schemas.ParticipantResponse)
def patch_camera(participant_id: int, payload: schemas.MediaStateUpdate, db: Session = Depends(get_db)):
    participant = crud.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return crud.update_camera(db, participant, payload.enabled)

@app.patch("/participants/{participant_id}/presence", response_model=schemas.ParticipantResponse)
def patch_presence(participant_id: int, payload: schemas.PresenceUpdate, db: Session = Depends(get_db)):
    participant = crud.get_participant(db, participant_id)
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return crud.update_presence(db, participant, payload.is_online)