mod commands;

use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.emit("window:close-requested", ()).unwrap();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::fs::scan_vault,
            commands::fs::read_note,
            commands::fs::write_note,
            commands::fs::list_dir,
            commands::fs::home_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
