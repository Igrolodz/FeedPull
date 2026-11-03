import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./styles/main.css";


function App(){
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unlisten = listen<string>("download-log", (event) => {
      setLogs((prev) => [...prev, event.payload]);
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

  return (
    <div className="app-yt">

      <nav>
        <div id="yt-page" className="page">
          <img src="" alt="YT" />
        </div>
        <div id="tt-page" className="page">
          <img src="" alt="TikTok" />
        </div>
        <div id="ig-page" className="page">
          <img src="" alt="Instagram" />
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
            placeholder="Paste YouTube link here..."
          />

          <button className="download-button" onClick={handleDownload}>Download</button>
        </form>

        <div className="progress">
          <p>{logs[logs.length - 1]}</p>
          <div className="progress-bar"
          style={{ width: logs.length ? `${parseInt(logs[logs.length - 1])}%` : "0%" }}
          >
            <span>{logs.length ? `${parseInt(logs[logs.length - 1])}%` : "0%"}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;