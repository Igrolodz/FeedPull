import yt_dlp # type: ignore
import sys
import json

def extract_metadata(url):
    ydl_opts = {
        "quiet": True,
        "noprogress": True,
        "skip_download": True
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get("formats", [])
        
        unique_height = set()
        unique_width = set()
        ratio = ""
        for f in formats:
            height = f.get("height")
            if height is not None:
                unique_height.add(height)
            width = f.get("width")
            if width is not None:
                unique_width.add(width)
        ratio = sorted(list(unique_width))[-1] / sorted(list(unique_height))[-1] if sorted(list(unique_height))[-1] is not None and sorted(list(unique_width))[-1] is not None else None
        if ratio is not None:
            if ratio > 1.1:
                ratio = "Landscape"
            elif ratio < 0.9:
                ratio = "Portrait"
            else:
                ratio = "Square"
                
        payload = {
            "unique_height": sorted(list(unique_height)),
            "ratio": ratio
        }
                
        print(json.dumps(payload))
            
    except Exception as e:
        print(f"Error downloading video: {e}", file=sys.stderr)
        sys.exit(1)
        
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No URL provided", file=sys.stderr)
        sys.exit(1)
        
    target_url = sys.argv[1]
    # target_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" # Landscape video
    # target_url = "https://www.youtube.com/shorts/MEtEBatnu7o" # Square video
    # target_url = "https://www.youtube.com/shorts/BIH4oKZXnbM" # Portrait video
    # target_url = "https://www.tiktok.com/@i_trile_i/video/7679626303657528583?is_from_webapp=1&sender_device=pc" # TikTok Portrait video
    
    extract_metadata(target_url)