import ffmpeg
import os

VIDEOS_DIR = "videos"

def render_video(input_path: str, overlays: list, output_path: str):
    """
    Renders video with overlays using ffmpeg.
    overlays: list of dicts {type, content, position, start_time, end_time}
    """
    stream = ffmpeg.input(input_path)

    for ov in overlays:
        if ov['type'] == 'text':
            # Simple text overlay example
            stream = ffmpeg.drawtext(
                stream,
                text=ov['content'],
                x=ov['position']['x'],
                y=ov['position']['y'],
                enable=f'between(t,{ov["start_time"]},{ov["end_time"]})',
                fontsize=24,
                fontcolor='white'
            )
        elif ov['type'] == 'image':
            img_path = os.path.join(VIDEOS_DIR, ov['content'])
            overlay_stream = ffmpeg.input(img_path)
            stream = ffmpeg.overlay(stream, overlay_stream, x=ov['position']['x'], y=ov['position']['y'], enable=f'between(t,{ov["start_time"]},{ov["end_time"]})')
        # Video overlay can be added similarly

    ffmpeg.output(stream, output_path).run(overwrite_output=True)
