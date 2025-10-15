from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import shutil
import asyncio
from typing import List
from .models import UploadRequest
from .renderer import render_video, VIDEOS_DIR

app = FastAPI(title="Buttercut AI Video Editor Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"],
)

if not os.path.exists(VIDEOS_DIR):
    os.makedirs(VIDEOS_DIR)

jobs = {}  # job_id -> status/output_path

@app.post("/upload")
async def upload_video(video: UploadFile = File(...), metadata: UploadRequest = None):
    job_id = str(uuid.uuid4())
    input_path = os.path.join(VIDEOS_DIR, f"{job_id}_{video.filename}")
    output_path = os.path.join(VIDEOS_DIR, f"{job_id}_rendered.mp4")

    # Save uploaded video
    with open(input_path, "wb") as f:
        shutil.copyfileobj(video.file, f)

    # Save metadata in memory
    jobs[job_id] = {"status": "processing", "output": output_path}

    # Run rendering in background
    asyncio.create_task(async_render(job_id, input_path, metadata.overlays, output_path))

    return {"job_id": job_id}


async def async_render(job_id, input_path, overlays, output_path):
    try:
        render_video(input_path, [ov.dict() for ov in overlays], output_path)
        jobs[job_id]["status"] = "completed"
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)


@app.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"job_id": job_id, "status": jobs[job_id]["status"]}


@app.get("/result/{job_id}")
async def get_result(job_id: str):
    if job_id not in jobs or jobs[job_id]["status"] != "completed":
        raise HTTPException(status_code=404, detail="Video not ready")
    return FileResponse(jobs[job_id]["output"], media_type="video/mp4")
