import sys
import yt_dlp
from pathlib import Path

def progress_hook(d):
    if d['status'] == 'downloading':
        total = d.get('total_bytes') or d.get('total_bytes_estimate')
        if total:
            print(round(d.get('downloaded_bytes', 0) * 100 / total), flush=True)

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