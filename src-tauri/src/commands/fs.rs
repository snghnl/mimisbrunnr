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

#[tauri::command]
pub fn duplicate_note(path: String) -> Result<String, String> {
    let src = Path::new(&path);
    if !src.exists() {
        return Err(format!("File does not exist: {}", path));
    }
    let content = fs::read(&path).map_err(|e| format!("Failed to read file: {}", e))?;
    let stem = src.file_stem().unwrap_or_default().to_string_lossy();
    let dir = src.parent().unwrap_or(Path::new("."));
    let mut candidate = dir.join(format!("{} copy.md", stem));
    let mut counter = 2u32;
    while candidate.exists() {
        candidate = dir.join(format!("{} copy {}.md", stem, counter));
        counter += 1;
    }
    let new_path = candidate.to_string_lossy().into_owned();
    fs::write(&candidate, content).map_err(|e| format!("Failed to write duplicate: {}", e))?;
    Ok(new_path)
}

#[tauri::command]
pub fn reveal_in_finder(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to reveal in Finder: {}", e))?;
    }
    #[cfg(target_os = "linux")]
    {
        let dir = Path::new(&path)
            .parent()
            .map(|p| p.to_string_lossy().into_owned())
            .unwrap_or(path.clone());
        std::process::Command::new("xdg-open")
            .arg(&dir)
            .spawn()
            .map_err(|e| format!("Failed to reveal in file manager: {}", e))?;
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(format!("/select,{}", path))
            .spawn()
            .map_err(|e| format!("Failed to reveal in Explorer: {}", e))?;
    }
    Ok(())
}

#[tauri::command]
pub fn create_note_in_dir(dir_path: String, title: String) -> Result<String, String> {
    let dir = Path::new(&dir_path);
    if !dir.exists() || !dir.is_dir() {
        return Err(format!("Directory does not exist: {}", dir_path));
    }
    let mut candidate = dir.join(format!("{}.md", title));
    let mut counter = 2u32;
    while candidate.exists() {
        candidate = dir.join(format!("{} {}.md", title, counter));
        counter += 1;
    }
    let full_path = candidate.to_string_lossy().into_owned();
    fs::write(&candidate, "").map_err(|e| format!("Failed to create note: {}", e))?;
    Ok(full_path)
}

#[tauri::command]
pub fn rename_dir(old_path: String, new_path: String) -> Result<(), String> {
    let src = Path::new(&old_path);
    let dst = Path::new(&new_path);
    if !src.exists() {
        return Err(format!("Directory does not exist: {}", old_path));
    }
    if dst.exists() {
        return Err(format!("Target already exists: {}", new_path));
    }
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename {} to {}: {}", old_path, new_path, e))
}

#[tauri::command]
pub fn delete_dir(path: String) -> Result<(), String> {
    let dir = Path::new(&path);
    if !dir.exists() {
        return Err(format!("Directory does not exist: {}", path));
    }
    fs::remove_dir_all(&path)
        .map_err(|e| format!("Failed to delete directory {}: {}", path, e))
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

    #[test]
    fn test_duplicate_note_success() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_dup_src.md").to_string_lossy().into_owned();
        fs::write(&src, "original content").unwrap();
        let result = duplicate_note(src.clone());
        assert!(result.is_ok());
        let dup = result.unwrap();
        assert!(dup.ends_with("mimisbrunnr_dup_src copy.md"));
        assert!(Path::new(&dup).exists());
        assert_eq!(fs::read_to_string(&dup).unwrap(), "original content");
        fs::remove_file(&src).unwrap();
        fs::remove_file(&dup).unwrap();
    }

    #[test]
    fn test_duplicate_note_unique_name() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_dup2_src.md").to_string_lossy().into_owned();
        let copy1 = tmp.join("mimisbrunnr_dup2_src copy.md").to_string_lossy().into_owned();
        fs::write(&src, "content").unwrap();
        fs::write(&copy1, "existing copy").unwrap();
        let result = duplicate_note(src.clone());
        assert!(result.is_ok());
        let dup = result.unwrap();
        assert!(dup.ends_with("mimisbrunnr_dup2_src copy 2.md"));
        fs::remove_file(&src).unwrap();
        fs::remove_file(&copy1).unwrap();
        fs::remove_file(&dup).unwrap();
    }

    #[test]
    fn test_duplicate_note_missing_source() {
        let tmp = std::env::temp_dir()
            .join("mimisbrunnr_dup_nonexistent_9999.md")
            .to_string_lossy()
            .into_owned();
        let result = duplicate_note(tmp);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }

    #[test]
    fn test_create_note_in_dir_success() {
        let tmp = std::env::temp_dir().join("mimisbrunnr_create_note_test_dir");
        fs::create_dir_all(&tmp).unwrap();
        let result = create_note_in_dir(
            tmp.to_string_lossy().into_owned(),
            "TestNote".to_string(),
        );
        assert!(result.is_ok());
        let path = result.unwrap();
        assert!(Path::new(&path).exists());
        assert!(path.ends_with("TestNote.md"));
        fs::remove_dir_all(&tmp).unwrap();
    }

    #[test]
    fn test_create_note_in_dir_unique_name() {
        let tmp = std::env::temp_dir().join("mimisbrunnr_create_note_unique_dir");
        fs::create_dir_all(&tmp).unwrap();
        fs::write(tmp.join("Untitled.md"), "").unwrap();
        let result = create_note_in_dir(
            tmp.to_string_lossy().into_owned(),
            "Untitled".to_string(),
        );
        assert!(result.is_ok());
        let path = result.unwrap();
        assert!(path.ends_with("Untitled 2.md"));
        fs::remove_dir_all(&tmp).unwrap();
    }

    #[test]
    fn test_create_note_in_dir_missing_dir() {
        let tmp = std::env::temp_dir()
            .join("mimisbrunnr_nonexistent_dir_99999")
            .to_string_lossy()
            .into_owned();
        let result = create_note_in_dir(tmp, "Note".to_string());
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }

    #[test]
    fn test_rename_dir_success() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_dir_src");
        let dst = tmp.join("mimisbrunnr_rename_dir_dst");
        fs::create_dir_all(&src).unwrap();
        let _ = fs::remove_dir_all(&dst);
        let result = rename_dir(
            src.to_string_lossy().into_owned(),
            dst.to_string_lossy().into_owned(),
        );
        assert!(result.is_ok());
        assert!(!src.exists());
        assert!(dst.exists());
        fs::remove_dir_all(&dst).unwrap();
    }

    #[test]
    fn test_rename_dir_missing_source() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_dir_missing_9999");
        let dst = tmp.join("mimisbrunnr_rename_dir_dst2");
        let _ = fs::remove_dir_all(&src);
        let result = rename_dir(
            src.to_string_lossy().into_owned(),
            dst.to_string_lossy().into_owned(),
        );
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }

    #[test]
    fn test_rename_dir_target_exists() {
        let tmp = std::env::temp_dir();
        let src = tmp.join("mimisbrunnr_rename_dir_src3");
        let dst = tmp.join("mimisbrunnr_rename_dir_dst3");
        fs::create_dir_all(&src).unwrap();
        fs::create_dir_all(&dst).unwrap();
        let result = rename_dir(
            src.to_string_lossy().into_owned(),
            dst.to_string_lossy().into_owned(),
        );
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("already exists"));
        fs::remove_dir_all(&src).unwrap();
        fs::remove_dir_all(&dst).unwrap();
    }

    #[test]
    fn test_delete_dir_success() {
        let tmp = std::env::temp_dir().join("mimisbrunnr_delete_dir_test");
        fs::create_dir_all(&tmp).unwrap();
        fs::write(tmp.join("note.md"), "content").unwrap();
        let result = delete_dir(tmp.to_string_lossy().into_owned());
        assert!(result.is_ok());
        assert!(!tmp.exists());
    }

    #[test]
    fn test_delete_dir_missing() {
        let tmp = std::env::temp_dir()
            .join("mimisbrunnr_delete_dir_nonexistent_9999")
            .to_string_lossy()
            .into_owned();
        let result = delete_dir(tmp);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("does not exist"));
    }
}
