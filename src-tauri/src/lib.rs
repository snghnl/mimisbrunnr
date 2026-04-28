mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
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
