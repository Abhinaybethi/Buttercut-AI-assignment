from pydantic import BaseModel
from typing import List, Literal, Optional

class Overlay(BaseModel):
    type: Literal['text', 'image', 'video']
    content: str  # text content or file name for image/video
    position: dict  # {x: int, y: int}
    start_time: float
    end_time: float

class UploadRequest(BaseModel):
    overlays: List[Overlay]
