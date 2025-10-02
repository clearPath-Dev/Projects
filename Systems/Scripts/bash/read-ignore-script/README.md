# Project Starter Script

A simple Bash script that automatically generates `README.md` and `.gitignore` files for new projects.

## Overview

This interactive script prompts you for a project directory and name, then creates:
- A templated `README.md` with the project name
- A Python-focused `.gitignore` file
- Success/failure confirmation messages

## Features

- 📝 Interactive prompts for project details
- 📄 Auto-generated README with basic structure
- 🚫 Pre-configured .gitignore for Python projects
- ✅ Validation feedback
- 🎯 Works with relative or absolute paths

## Installation

### Quick Setup

```bash
# Download the script
curl -O https://raw.githubusercontent.com/yourusername/project-starter/main/read_ignore.sh

# Make it executable
chmod +x read_ignore.sh
```

### Add to PATH (Optional)

```bash
# Move to a directory in your PATH
sudo mv read_ignore.sh /usr/local/bin/init-project

# Now run from anywhere
init-project
```

## Usage

### Basic Usage

```bash
./read_ignore.sh
```

The script will prompt you for:
1. **Project directory** - Where to create the files (can be relative or absolute)
2. **Project name** - Name of your project (used in README)

### Example Session

```bash
$ ./read_ignore.sh
Enter project directory (relative or absolute path):
./my-new-project

Enter project name:
My Awesome Project

✅ README.md and .gitignore created in ./my-new-project
.gitignore created successfully ✅
```

### Directory Path Examples

```bash
# Relative path
./my-project

# Absolute path
/home/user/projects/my-project

# Current directory
.

# Parent directory
../my-project

# Nested path
./projects/web/my-app
```

## Generated Files

### README.md Template

The script generates a basic README with:
- Project name as header
- Description placeholder
- Usage section with Python command
- Lowercase script name suggestion

Example output:
```markdown
# My Project

Description here.

## Usage

\`\`\`bash
python my_project.py
\`\`\`
```

### .gitignore Contents

Pre-configured for Python projects:
```
__pycache__/
*.pyc
.venv/
*.log
.DS_Store
```

## Customization

### Modify README Template

Edit the `cat > "$DIR/README.md"` section:

```bash
cat > "$DIR/README.md" <<EOF
# $NAME

## Description
Your custom description section.

## Installation
\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage
\`\`\`bash
python $(echo "$NAME" | tr '[:upper:]' '[:lower:]').py
\`\`\`

## License
MIT
EOF
```

### Customize .gitignore

Add more patterns to the `.gitignore` section:

```bash
cat > "$DIR/.gitignore" <<EOF
# Python
__pycache__/
*.pyc
*.pyo
.venv/
venv/
ENV/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment
.env
.env.local
EOF
```

### Add More File Types

Create additional files by adding more sections:

```bash
# Create requirements.txt
cat > "$DIR/requirements.txt" <<EOF
# Add your dependencies here
EOF

# Create main.py
cat > "$DIR/main.py" <<EOF
#!/usr/bin/env python3

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
EOF
```

## Advanced Usage

### Create Directory Structure

Enhance the script to create directories:

```bash
#!/bin/bash

echo "Enter project directory:"
read DIR

echo "Enter project name:"
read NAME

# Create project structure
mkdir -p "$DIR"/{src,tests,docs}

# Create files...
```

### Multi-Language Support

Add language selection:

```bash
echo "Select language (python/node/go):"
read LANG

case $LANG in
  python)
    cat > "$DIR/.gitignore" <<EOF
__pycache__/
*.pyc
.venv/
EOF
    ;;
  node)
    cat > "$DIR/.gitignore" <<EOF
node_modules/
*.log
.env
EOF
    ;;
  go)
    cat > "$DIR/.gitignore" <<EOF
*.exe
*.test
vendor/
EOF
    ;;
esac
```

### Template Selection

Offer multiple README templates:

```bash
echo "Select template (basic/detailed/minimal):"
read TEMPLATE

case $TEMPLATE in
  basic)
    # Basic template
    ;;
  detailed)
    # Detailed template with more sections
    ;;
  minimal)
    # Minimal template
    ;;
esac
```

## Troubleshooting

### Permission Denied

```bash
# Make sure script is executable
chmod +x read_ignore.sh
```

### Directory Doesn't Exist

The script requires the directory to exist. Create it first:

```bash
mkdir -p /path/to/project
./read_ignore.sh
```

Or modify the script to create directories automatically:

```bash
# Add after reading DIR
mkdir -p "$DIR"
```

### Files Already Exist

The script will overwrite existing files. To prevent this, add checks:

```bash
if [ -f "$DIR/README.md" ]; then
  echo "README.md already exists. Overwrite? (y/n)"
  read OVERWRITE
  if [ "$OVERWRITE" != "y" ]; then
    exit 1
  fi
fi
```

### Special Characters in Name

If your project name has special characters, they'll appear in the README. Sanitize if needed:

```bash
# Remove special characters for filename
SAFE_NAME=$(echo "$NAME" | tr -cd '[:alnum:]_-')
```

## Use Cases

### Quick Project Initialization
```bash
# Start a new Python project
mkdir my-project && cd my-project
../read_ignore.sh
# Enter: .
# Enter: My Project
```

### Batch Project Creation
```bash
# Create multiple projects
for project in api-service web-client data-pipeline; do
  mkdir "$project"
  echo -e "$project\n${project^}" | ./read_ignore.sh
done
```

### Template for Team
```bash
# Standardize project structure across team
# Customize script with company standards
# Share with team via git repo
```

## Integration Ideas

### Git Hook
```bash
# In .git/hooks/post-init
#!/bin/bash
./read_ignore.sh
```

### IDE Integration
```bash
# VS Code task in .vscode/tasks.json
{
  "label": "Initialize Project Files",
  "type": "shell",
  "command": "./read_ignore.sh"
}
```

### CI/CD Pipeline
```bash
# In your pipeline script
if [ ! -f "README.md" ]; then
  echo -e ".\nProject Name" | ./read_ignore.sh
fi
```

## Enhancements

Ideas to extend functionality:

- [ ] Add LICENSE file generation
- [ ] Create src/ and tests/ directories
- [ ] Generate requirements.txt or package.json
- [ ] Add pre-commit hooks
- [ ] Support for multiple languages
- [ ] Interactive template selection
- [ ] Backup existing files before overwriting
- [ ] Validate directory exists or create it
- [ ] Add CHANGELOG.md template
- [ ] Include CONTRIBUTING.md

## Example Enhanced Version

```bash
#!/bin/bash

echo "Enter project directory (will be created if doesn't exist):"
read DIR

echo "Enter project name:"
read NAME

echo "Enter project description:"
read DESC

# Create directory if it doesn't exist
mkdir -p "$DIR"

# Create README.md with description
cat > "$DIR/README.md" <<EOF
# $NAME

$DESC

## Installation

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`bash
python $(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_').py
\`\`\`

## Contributing

Pull requests are welcome!

## License

MIT
EOF

# Create comprehensive .gitignore
cat > "$DIR/.gitignore" <<EOF
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
.venv/
venv/
ENV/
env/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Environment
.env
.env.local
EOF

# Create requirements.txt
cat > "$DIR/requirements.txt" <<EOF
# Add your project dependencies here
EOF

echo "✅ Project initialized in $DIR"
echo "Files created:"
echo "  - README.md"
echo "  - .gitignore"
echo "  - requirements.txt"
```

## Contributing

To contribute to this script:

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - Free to use and modify

## Version History

### v1.0.0
- Initial release
- Basic README generation
- Python .gitignore
- Interactive prompts

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation
- Review examples above

---

**Pro Tip**: Customize this script for your team's specific needs and commit it to your organization's tools repository!
