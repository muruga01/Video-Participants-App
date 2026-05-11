from .database import SessionLocal, engine, Base
from .models import Participant

Base.metadata.create_all(bind=engine)

seed_data = [
    {
        "name": "Aarav Menon",
        "email": "aarav@example.com",
        "role": "Frontend Developer",
        "avatar_url": "",
        "is_online": True,
        "mic_enabled": True,
        "camera_enabled": False,
    },
    {
        "name": "Priya Sharma",
        "email": "priya@example.com",
        "role": "Product Manager",
        "avatar_url": "",
        "is_online": False,
        "mic_enabled": False,
        "camera_enabled": True,
    },
    {
        "name": "Rohan Iyer",
        "email": "rohan@example.com",
        "role": "Backend Engineer",
        "avatar_url": "",
        "is_online": True,
        "mic_enabled": True,
        "camera_enabled": True,
    },
]

db = SessionLocal()
try:
    if db.query(Participant).count() == 0:
        for item in seed_data:
            db.add(Participant(**item))
        db.commit()
finally:
    db.close()