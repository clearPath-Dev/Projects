#!/bin/bash

echo "Enter project directory (relative or absolute path):"
read DIR

echo "Enter project name:"
read NAME

# Create README.md
cat > "$DIR/README.md" <<EOF
# $NAME

Description here.

## Usage

\`\`\`bash
python $(echo "$NAME" | tr '[:upper:]' '[:lower:]').py
\`\`\`
EOF

# Create .gitignore
cat > "$DIR/.gitignore" <<EOF
__pycache__/
*.pyc
.venv/
*.log
.DS_Store
EOF

if [ -f "$DIR/.gitignore" ]; then
  echo ".gitignore created successfully ✅"
else
  echo "❌ .gitignore not created"
fi

echo "✅ README.md and .gitignore created in $DIR"

