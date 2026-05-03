use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[derive(serde::Serialize)]
pub struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
    has_md: bool,
}

#[tauri::command]
pub fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
    let dir = Path::new(&path);

    if !dir.exists() {
        return Err(format!("Path does not exist: {}", path));
    }
    if !dir.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }

    let mut entries: Vec<DirEntry> = fs::read_dir(dir)
        .map_err(|e| format!("Failed to read directory {}: {}", path, e))?
        .filter_map(|e| e.ok())
        .filter(|e| {
            let name = e.file_name();
            !name.to_string_lossy().starts_with('.')
        })
        .filter_map(|e| {
            let meta = e.metadata().ok()?;
            let name = e.file_name().to_string_lossy().into_owned();
            let full_path = e.path().to_string_lossy().into_owned();
            let is_dir = meta.is_dir();

            let has_md = if is_dir {
                fs::read_dir(e.path()).ok().map_or(false, |mut rd| {
                    rd.any(|child| {
                        child.ok().map_or(false, |c| {
                            c.path().extension().map_or(false, |ext| ext == "md")
                        })
                    })
                })
            } else {
                false
            };

            Some(DirEntry { name, path: full_path, is_dir, has_md })
        })
        .collect();

    entries.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));

    Ok(entries)
}

#[tauri::command]
pub fn home_dir() -> Result<String, String> {
    dirs::home_dir()
        .and_then(|p| p.to_str().map(String::from))
        .ok_or_else(|| "Failed to resolve home directory".into())
}

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

#[tauri::command]
pub fn delete_note(path: String) -> Result<(), String> {
    let file_path = Path::new(&path);
    if !file_path.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    fs::remove_file(&path).map_err(|e| format!("Failed to delete file {}: {}", path, e))
}

#[tauri::command]
pub fn rename_note(old_path: String, new_path: String) -> Result<(), String> {
    let src = Path::new(&old_path);
    let dst = Path::new(&new_path);
    if !src.exists() {
        return Err(format!("Source file does not exist: {}", old_path));
    }
    if dst.exists() {
        return Err(format!("Target already exists: {}", new_path));
    }
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename {} to {}: {}", old_path, new_path, e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_delete_note_success() {
        let path = std::env::temp_dir()
            .join("mimisbrunnr_test_delete_note.md")
            .to_string_lossy()
            .into_owned();
        fs::write(&path, "test content").unwrap();
        let result = delete_note(path.clone());
        assert!(result.is_ok());
        assert!(!Path::new(&path).exists());
    }

    #[test]
    fn test_delete_note_missing_file() {
        let path = std::env::temp_dir()
            .join("mimisbrunnr_test_nonexistent_1234567890.md")
            .to_string_lossy()
            .into_owned();
        let result = delete_note(path);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }

    #[test]
    fn test_rename_note_success() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_src.md").to_string_lossy().into_owned();
        let dst = tmp.join("mimisbrunnr_rename_dst.md").to_string_lossy().into_owned();
        fs::write(&src, "content").unwrap();
        let _ = fs::remove_file(&dst);
        let result = rename_note(src.clone(), dst.clone());
        assert!(result.is_ok());
        assert!(!Path::new(&src).exists());
        assert!(Path::new(&dst).exists());
        fs::remove_file(&dst).unwrap();
    }

    #[test]
    fn test_rename_note_missing_source() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_missing.md").to_string_lossy().into_owned();
        let dst = tmp.join("mimisbrunnr_rename_dst2.md").to_string_lossy().into_owned();
        let _ = fs::remove_file(&src);
        let result = rename_note(src, dst);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }

    #[test]
    fn test_rename_note_target_exists() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_src3.md").to_string_lossy().into_owned();
        let dst = tmp.join("mimisbrunnr_rename_dst3.md").to_string_lossy().into_owned();
        fs::write(&src, "src content").unwrap();
        fs::write(&dst, "dst content").unwrap();
        let result = rename_note(src.clone(), dst.clone());
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("already exists"));
        fs::remove_file(&src).unwrap();
        fs::remove_file(&dst).unwrap();
    }
}
