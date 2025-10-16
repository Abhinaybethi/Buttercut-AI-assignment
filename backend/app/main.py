from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for testing
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_video(
    video: UploadFile = File(...), 
    overlays: str = Form(...)
):
    # Parse overlays JSON
    overlays_data = json.loads(overlays)

    # Save uploaded video
    video_id = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_DIR, f"{video_id}_{video.filename}")
    with open(video_path, "wb") as f:
        f.write(await video.read())

    # Return job ID
    job_id = str(uuid.uuid4())
    # You can store metadata in a dict or DB for later processing
    print(f"Saved video: {video_path}")
    print(f"Overlays: {overlays_data}")

    return {"job_id": job_id}
