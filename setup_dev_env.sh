#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# ParksRadar TypeScript Development Environment Setup (WSL + Ubuntu)
# ---------------------------------------------------------------------------

set -e

echo "🔧 Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

echo "📦 Installing core packages..."
sudo apt install -y curl git build-essential

# ---------------------------------------------------------------------------
# 🌐 Node + TypeScript setup
# ---------------------------------------------------------------------------
echo "🌐 Installing Node.js (LTS) and npm..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

echo "📦 Installing global dev tools..."
sudo npm install -g typescript eslint prettier

# ---------------------------------------------------------------------------
# 🧩 Project configuration
# ---------------------------------------------------------------------------
echo "🧩 Initializing TypeScript + ESLint + Prettier setup..."
cd ~/ParksRadar

npm init -y

npm install --save-dev \
  typescript \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  eslint-plugin-jsdoc \
  eslint-plugin-import \
  eslint-plugin-react \
  eslint-plugin-react-hooks

# ---------------------------------------------------------------------------
# 🧰 Create configuration files
# ---------------------------------------------------------------------------

echo "🧰 Writing tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "📏 Writing ESLint configuration (.eslintrc.json)..."
cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsdoc/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react",
    "jsdoc",
    "prettier"
  ],
  "rules": {
    "max-len": ["error", { "code": 80, "ignoreUrls": true }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "prettier/prettier": "error",
    "jsdoc/require-param": "warn",
    "jsdoc/require-returns": "warn",
    "jsdoc/require-description": "warn",
    "jsdoc/check-tag-names": "warn"
  },
  "settings": {
    "react": { "version": "detect" }
  }
}
EOF

echo "🎨 Writing Prettier configuration (.prettierrc)..."
cat > .prettierrc << 'EOF'
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
EOF

echo "🧱 Writing EditorConfig (.editorconfig)..."
cat > .editorconfig << 'EOF'
# Root EditorConfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
indent_style = space
indent_size = 2
max_line_length = 80
EOF

# ---------------------------------------------------------------------------
# 🧹 Optional: pre-commit formatting
# ---------------------------------------------------------------------------
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
echo "🧹 Running ESLint + Prettier before commit..."
npm run lint --silent || exit 1
npm run format --silent || exit 1
EOF
chmod +x .git/hooks/pre-commit

# ---------------------------------------------------------------------------
# 🧾 Add useful npm scripts
# ---------------------------------------------------------------------------
npx json -I -f package.json -e '
this.scripts = {
  "build": "tsc",
  "start": "node dist/index.js",
  "lint": "eslint \"src/**/*.{ts,tsx}\"",
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,html}\""
}
'

echo "✅ Setup complete! Run the following next:"
echo "   1️⃣  cd ~/ParksRadar"
echo "   2️⃣  npm run lint   # Check for issues"
echo "   3️⃣  npm run format # Auto-fix styling"
echo "   4️⃣  npm run build  # Compile TypeScript"
