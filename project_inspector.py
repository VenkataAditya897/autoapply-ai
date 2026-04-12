import os

OUTPUT_FILE = "project_structure_report.txt"

# Folders to ignore completely
IGNORE_DIRS = {"__pycache__", ".venv", "venv", ".git", "node_modules",".next","frontend","user_data"}

# File extensions to ignore (binary / unnecessary)
IGNORE_EXTENSIONS = {
    ".pyc", ".exe", ".dll",
    ".png", ".jpg", ".jpeg", ".gif",
     ".zip", ".tar", ".gz",".svg"
}

# Specific file names to ignore
IGNORE_FILES = {
    OUTPUT_FILE,          # Ignore the generated report itself
    "project_inspector.py",  # Ignore this script file
    "package-lock.json"
}


def should_ignore_file(file_name):
    _, ext = os.path.splitext(file_name)

    if file_name in IGNORE_FILES:
        return True

    if ext.lower() in IGNORE_EXTENSIONS:
        return True

    return False


def write_tree(start_path, output):
    output.write("📁 PROJECT STRUCTURE:\n\n")

    for root, dirs, files in os.walk(start_path):
        # Remove ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        level = root.replace(start_path, "").count(os.sep)
        indent = "│   " * level
        output.write(f"{indent}├── {os.path.basename(root)}/\n")

        sub_indent = "│   " * (level + 1)
        for file in files:
            if should_ignore_file(file):
                continue
            output.write(f"{sub_indent}├── {file}\n")


def write_files_content(start_path, output):
    output.write("\n\n📄 FILE DETAILS WITH CONTENT:\n\n")

    for root, dirs, files in os.walk(start_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            if should_ignore_file(file):
                continue

            full_path = os.path.join(root, file)

            output.write("=" * 80 + "\n")
            output.write(f"📍 FULL PATH: {full_path}\n")
            output.write("=" * 80 + "\n\n")

            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    output.write(content + "\n\n")
            except Exception as e:
                output.write(f"⚠️ Could not read file: {e}\n\n")


if __name__ == "__main__":
    project_root = os.getcwd()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as output:
        write_tree(project_root, output)
        write_files_content(project_root, output)

    print(f"\n✅ Project report generated successfully: {OUTPUT_FILE}")