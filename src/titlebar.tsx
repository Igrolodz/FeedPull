import "./styles/titlebar.css";
import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

function TitleBar() {
  return (
    <div className="titlebar" data-tauri-drag-region>
        <div className="titlebar-title" data-tauri-drag-region>FeedPull</div>
        <div className="titlebar-controls">
            <button id="titlebar-minimize" className="titlebar-button" onClick={() => appWindow.minimize()}>−</button>
            <button id="titlebar-maximize" className="titlebar-button" onClick={() => appWindow.toggleMaximize()}>□</button>
            <button id="titlebar-close" className="titlebar-button close" onClick={() => appWindow.close()}>×</button>
        </div>
    </div>
  );
}

export default TitleBar;