import json
import sys
import yt_dlp # type: ignore
from pathlib import Path

def progress_hook(d):
    if d['status'] == 'downloading':
        total = d.get('total_bytes') or d.get('total_bytes_estimate')
        percent_str = "0"
        if total:
            percent_str = round(d.get('downloaded_bytes', 0) * 100 / total)
        speed = d.get('speed')
        speed_str = round(speed / 1_000_000, 1) if speed is not None else None
        eta_str = d.get('eta')
        
        payload = {
            "status": d['status'],
            "percent": percent_str,
            "speed": speed_str,
            "eta": eta_str
        }
        print(json.dumps(payload), flush=True)
    if d['status'] == 'finished':
        payload = {
            "status": d['status'],
            "percent": "100",
            "speed": None,
            "eta": None
        }
        print(json.dumps(payload), flush=True)

downloads_path = str(Path.home() / "Downloads")

def download(url):
    ydl_opts = {
        "outtmpl": f"{downloads_path}/%(title)s.%(ext)s",
        "quiet": True,
        "noprogress": True,
        "progress_hooks": [progress_hook]
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        print(f"Error downloading video: {e}", file=sys.stderr)
        sys.exit(1)
        
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No URL provided", file=sys.stderr)
        sys.exit(1)
        
    target_url = sys.argv[1]
    # target_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    
    download(target_url)