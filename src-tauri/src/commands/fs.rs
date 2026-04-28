use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[tauri::command]
pub fn scan_vault(vault_path: String) -> Result<Vec<String>, String> {
    let root = Path::new(&vault_path);

    if !root.exists() {
        return Err(format!("Vault path does not exist: {}", vault_path));
    }
    if !root.is_dir() {
        return Err(format!("Path is not a directory: {}", vault_path));
    }

    let files = WalkDir::new(root)
        .follow_links(false)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            entry.file_type().is_file()
                && entry.path().extension().map_or(false, |ext| ext == "md")
        })
        .filter_map(|entry| {
            entry
                .path()
                .strip_prefix(root)
                .ok()
                .and_then(|rel| rel.to_str())
                .map(|s| s.replace('\\', "/"))
        })
        .collect();

    Ok(files)
}

#[tauri::command]
pub fn read_note(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file {}: {}", path, e))
}

#[tauri::command]
pub fn write_note(path: String, content: String) -> Result<(), String> {
    let file_path = Path::new(&path);

    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directories for {}: {}", path, e))?;
    }

    fs::write(&path, content).map_err(|e| format!("Failed to write file {}: {}", path, e))
}
