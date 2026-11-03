import "./styles/titlebar.css";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

document.getElementById("titlebar-minimize")?.addEventListener("click", () => {
    // console.log("Minimize button clicked");
    appWindow.minimize();
});
document.getElementById("titlebar-maximize")?.addEventListener("click", () => {
    // console.log("Maximize button clicked");
    appWindow.toggleMaximize();
});
document.getElementById("titlebar-close")?.addEventListener("click", () => {
    // console.log("Close button clicked");
    appWindow.close();
});

function TitleBar() {
  return (
    <div className="titlebar" data-tauri-drag-region>
        <div className="titlebar-title" data-tauri-drag-region>FeedPull</div>
        <div className="titlebar-controls">
            <button id="titlebar-minimize" className="titlebar-button">−</button>
            <button id="titlebar-maximize" className="titlebar-button">□</button>
            <button id="titlebar-close" className="titlebar-button close">×</button>
        </div>
    </div>
  );
}

export default TitleBar;