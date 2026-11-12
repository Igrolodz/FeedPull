import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./styles/main.css";


function App(){
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [platform, setPlatform] = useState("YouTube");
  const [quality, setQuality] = useState("1080p");

  useEffect(() => {
    const unlisten = listen<string>("download-log", (event) => {
      setLogs((prev) => [...prev, event.payload]);
      console.log(event.payload);

      const data: { status: string; percent: string; speed: string; eta: string } = JSON.parse(event.payload);

      const progressBarText = document.getElementById("progress-bar-text");
      if(progressBarText){
         progressBarText.style.opacity = parseInt(data.percent) >= 10 ? "1" : "0";
      }
      
      const logger = document.getElementById("logger");
      if (logger && data.status === "finished") {
        logger.textContent = "Download Completed!";
      }
      else if (logger && data.status === "downloading") {
        logger.textContent = `Speed: ${data.speed}MB/s - ETA: `;

        if(data.eta && parseInt(data.eta) >= 60){
          const minutes = Math.floor(parseInt(data.eta) / 60);
          const seconds = parseInt(data.eta) % 60;
          logger.textContent += `${minutes}m ${seconds}s`;
        } else if (data.eta) {
          logger.textContent += `${data.eta}s`;
        }
      }

    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleDownload = async () => {
    try {
      const response = await invoke("download_video", { url });
      console.log(response);
    } catch (error) {
      console.error("Failed to start download:", error);
    }
  };

  const handlePageClick = (pageId: string) => {
    const pages: { id: string; platform: string }[] = [
      { id: "yt-page", platform: "YouTube" },
      { id: "tt-page", platform: "TikTok" },
      { id: "ig-page", platform: "Instagram" },
    ];

    pages.forEach((page) => {
      const element = document.getElementById(page.id);
      if (element) {
        element.style.zIndex = page.id === pageId ? "1" : "auto";
        element.style.border = page.id === pageId ? "1px solid #F472B6" : "";
      }
    });

    const selected = pages.find((page) => page.id === pageId);
    if (selected) {
      setPlatform(selected.platform);
    }
  };

  useEffect(() => {
    handlePageClick("yt-page");
  }, []);

  const formatClick = (format: string) => {
    const audioButton = document.getElementById("audio-format");
    const videoButton = document.getElementById("video-format");
    if (audioButton && videoButton) {
      if (format === "audio") {
        audioButton.style.border = "3px solid #F472B6";
        videoButton.style.border = "";
      } else {
        videoButton.style.border = "3px solid #F472B6";
        audioButton.style.border = "";
      }
    }
  };

  const qualityClick = (quality: string) =>{
    setQuality(quality);
    const buttons = document.querySelector("#quality-wrapper")?.children;
    if (buttons) {
      Array.from(buttons).forEach(button => {
        (button as HTMLElement).style.border = "";
      });
    }
    const selectedButton = document.getElementById(quality);
    if (selectedButton) {
      selectedButton.style.border = "3px solid #6366F1";
    }
  }

  return (
    <div className="app-yt">

      <nav>
        <div id="yt-page" className="page" onClick={() => handlePageClick("yt-page")}>
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 333333 333333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd"><path d="M329930 100020s-3254-22976-13269-33065c-12691-13269-26901-13354-33397-14124-46609-3396-116614-3396-116614-3396h-122s-69973 0-116608 3396c-6522 793-20712 848-33397 14124C6501 77044 3316 100020 3316 100020S-1 126982-1 154001v25265c0 26962 3315 53979 3315 53979s3254 22976 13207 33082c12685 13269 29356 12838 36798 14254 26685 2547 113354 3315 113354 3315s70065-124 116675-3457c6522-770 20706-848 33397-14124 10021-10089 13269-33090 13269-33090s3319-26962 3319-53979v-25263c-67-26962-3384-53979-3384-53979l-18 18-2-2zM132123 209917v-93681l90046 46997-90046 46684z" fill="red"/></svg>
        </div>
        <div id="tt-page" className="page" onClick={() => handlePageClick("tt-page")}>
          <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 512"><rect width="512" height="512" rx="116.056" ry="116.056"/><path fill="#2DCCD3" fillRule="nonzero" d="M348.868 152.076c12.815 13.213 28.795 21.265 44.9 24.93v-9.922c-15.132-1.073-30.964-5.834-44.9-15.008zm-92.569-65.444v221.885c0 29.069-20.892 47.767-46.296 47.767-8.427 0-16.43-1.969-23.386-5.609 8.826 11.269 22.762 17.751 38.045 17.751 25.405 0 46.297-18.698 46.297-47.793V98.748h40.263a110.44 110.44 0 01-2.693-12.116h-52.23zm-33.033 128.992V204.63c-5.086-.848-10.172-1.122-14.385-1.122-57.316 0-105.309 45.998-105.309 103.04 0 37.446 18.225 69.457 45.923 88.405-19.296-19.147-31.263-45.948-31.263-76.289 0-56.943 47.843-102.915 105.034-103.04z"/><path fill="#F1204A" fillRule="nonzero" d="M314.438 304.852c0 70.854-54.199 108.4-105.283 108.4-22.114 0-42.657-6.681-59.66-18.299 19.097 18.947 45.375 30.415 74.319 30.415 51.084 0 105.284-37.546 105.284-108.399V201.514c-5.086-3.441-9.973-7.455-14.66-12.142v115.48zm-127.82 45.824c-6.233-7.879-9.948-18.076-9.948-30.043 0-33.582 26.252-51.332 61.255-47.643v-56.244c-5.085-.847-10.171-1.122-14.41-1.122h-.249v45.225c-35.003-3.664-61.256 14.061-61.256 47.668 0 19.645 10.048 34.554 24.608 42.159zm207.151-173.67v42.009c-23.261 0-45.275-4.438-64.671-17.501 22.587 22.587 49.986 29.642 79.33 29.642V179.2a90.834 90.834 0 01-14.659-2.194zm-44.901-24.93c-12.391-12.74-21.84-30.292-25.679-53.328h-11.967c6.831 24.906 20.892 42.283 37.646 53.328z"/><path fill="#fff" fillRule="nonzero" d="M209.155 413.252c51.083 0 105.283-37.547 105.283-108.4v-115.48c4.688 4.687 9.574 8.701 14.66 12.141 19.396 13.065 41.41 17.502 64.671 17.502v-42.009c-16.106-3.664-32.087-11.717-44.901-24.93-16.754-11.045-30.815-28.422-37.646-53.328h-40.263v221.886c0 29.094-20.893 47.792-46.297 47.792-15.283 0-29.219-6.482-38.045-17.751-14.559-7.603-24.606-22.513-24.606-42.158 0-33.607 26.252-51.333 61.255-47.668v-45.225c-57.192.125-105.035 46.098-105.035 103.04 0 30.341 11.967 57.141 31.265 76.288 17.002 11.618 37.545 18.3 59.659 18.3z"/></svg>
        </div>
        <div id="ig-page" className="page" onClick={() => handlePageClick("ig-page")}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132.004 132"><defs><linearGradient id="b"><stop offset="0" stopColor="#3771c8"/><stop stopColor="#3771c8" offset=".128"/><stop offset="1" stopColor="#60f" stopOpacity="0"/></linearGradient><linearGradient id="a"><stop offset="0" stopColor="#fd5"/><stop offset=".1" stopColor="#fd5"/><stop offset=".5" stopColor="#ff543e"/><stop offset="1" stopColor="#c837ab"/></linearGradient><radialGradient id="c" cx="158.429" cy="578.088" r="65" xlinkHref="#a" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 -1.98198 1.8439 0 -1031.402 454.004)" fx="158.429" fy="578.088"/><radialGradient id="d" cx="147.694" cy="473.455" r="65" xlinkHref="#b" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.17394 .86872 -3.5818 .71718 1648.348 -458.493)" fx="147.694" fy="473.455"/></defs><path fill="url(#c)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="url(#d)" d="M65.03 0C37.888 0 29.95.028 28.407.156c-5.57.463-9.036 1.34-12.812 3.22-2.91 1.445-5.205 3.12-7.47 5.468C4 13.126 1.5 18.394.595 24.656c-.44 3.04-.568 3.66-.594 19.188-.01 5.176 0 11.988 0 21.125 0 27.12.03 35.05.16 36.59.45 5.42 1.3 8.83 3.1 12.56 3.44 7.14 10.01 12.5 17.75 14.5 2.68.69 5.64 1.07 9.44 1.25 1.61.07 18.02.12 34.44.12 16.42 0 32.84-.02 34.41-.1 4.4-.207 6.955-.55 9.78-1.28 7.79-2.01 14.24-7.29 17.75-14.53 1.765-3.64 2.66-7.18 3.065-12.317.088-1.12.125-18.977.125-36.81 0-17.836-.04-35.66-.128-36.78-.41-5.22-1.305-8.73-3.127-12.44-1.495-3.037-3.155-5.305-5.565-7.624C116.9 4 111.64 1.5 105.372.596 102.335.157 101.73.027 86.19 0H65.03z" transform="translate(1.004 1)"/><path fill="#fff" d="M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z"/></svg>
        </div>
      </nav>
      <main className="container">
        <h1 className="title">Pull your videos!</h1>
        
        <form action="">
          <input
            id="url-input"
            className="url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={`Paste ${platform} link here...`}
          />

          <div className="format-wrapper">
            <button type="button" id="audio-format" className="format-button" onClick={() => formatClick("audio")}>Audio</button>
            <button type="button" id="video-format" className="format-button" onClick={() => formatClick("video")}>Video</button>
          </div>

          <div id="quality-wrapper">
            <button id="720p" type="button" className="quality-button" onClick={() => qualityClick("720p")}>720p</button>
            <button id="1080p" type="button" className="quality-button" onClick={() => qualityClick("1080p")}>1080p</button>
            <button id="4K" type="button" className="quality-button" onClick={() => qualityClick("4K")}>4K</button>
          </div>

          <button className="download-button" onClick={handleDownload} type="button">Download</button>
        </form>

        <span id="logger"></span>
        <div className="progress">
          <div className="progress-bar"
          style={{ width: logs.length ? `${JSON.parse(logs[logs.length - 1]).percent}%` : "0%" }}
          >
            <span id="progress-bar-text">{logs.length ? `${JSON.parse(logs[logs.length - 1]).percent}%` : "0%"}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;