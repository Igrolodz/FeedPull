use tauri_plugin_shell::ShellExt;
use tauri::Emitter;

#[tauri::command]
async fn download_video(app: tauri::AppHandle, url: String, quality: String, format: String) -> Result<String, String> {
    let sidecar = app.shell()
    .sidecar("downloader")
    .map_err(|e| e.to_string())?
    .args([&url, &quality, &format]);

    let (mut rx, _child) = sidecar.spawn().map_err(|e| e.to_string())?;

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let tauri_plugin_shell::process::CommandEvent::Stdout(line_bytes) = event {
                let line = String::from_utf8_lossy(&line_bytes);
                let _ = app.emit("download-log", line.to_string());
            }
        }
    });

    Ok(format!("Download started for URL: {}", url))
}

#[tauri::command]
async fn extract_metadata(app: tauri::AppHandle, url: String) -> Result<String, String> {
    let sidecar = app.shell()
        .sidecar("extractor")
        .map_err(|e| e.to_string())?
        .args([&url]);

    let output = sidecar
        .output()
        .await
        .map_err(|e| e.to_string())?;
    
    
    if output.status.success() == false {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![download_video, extract_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
