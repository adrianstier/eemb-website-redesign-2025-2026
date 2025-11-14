#!/bin/bash

# EEMB Website Development Environment Setup
# This script sets up your local development environment

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         EEMB Website Development Environment Setup         ║"
echo "║                   Complete Local Setup                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check operating system
OS="Unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

print_info "Detected OS: $OS"
echo ""

# Check required tools
echo "🔍 Checking required tools..."
echo "=============================="

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"

    # Check if version is 18+
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | cut -dv -f2)
    if [ $NODE_MAJOR -lt 18 ]; then
        print_warning "Node.js 18+ recommended (you have $NODE_VERSION)"
    fi
else
    print_error "Node.js not installed"
    echo "  Install from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm installed: v$NPM_VERSION"
else
    print_error "npm not installed"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python installed: $PYTHON_VERSION"
else
    print_error "Python 3 not installed"
    echo "  Install from: https://www.python.org/"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    print_success "Git installed: v$GIT_VERSION"
else
    print_error "Git not installed"
    exit 1
fi

# Check PostgreSQL (optional for local dev)
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | cut -d' ' -f3)
    print_success "PostgreSQL installed: $PSQL_VERSION"
else
    print_warning "PostgreSQL not installed (optional - can use Supabase)"
    echo "  Install from: https://www.postgresql.org/download/"
fi

echo ""

# Create project structure
echo "📁 Setting up project structure..."
echo "==================================="

# Create directories if they don't exist
directories=(
    "backend"
    "frontend"
    "scripts/data-import"
    "scripts/backup"
    "scripts/deploy"
    "docs/api"
    "docs/admin"
    "infrastructure/docker"
    "infrastructure/ci-cd"
)

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        print_success "Created $dir"
    else
        print_info "$dir already exists"
    fi
done

echo ""

# Install global npm packages
echo "📦 Installing global npm packages..."
echo "====================================="

# Check if packages are already installed
packages_to_install=()

if ! command -v strapi &> /dev/null; then
    packages_to_install+=("@strapi/strapi")
fi

if ! command -v next &> /dev/null; then
    packages_to_install+=("next")
fi

if ! command -v playwright &> /dev/null; then
    packages_to_install+=("playwright")
fi

if [ ${#packages_to_install[@]} -eq 0 ]; then
    print_success "All global packages already installed"
else
    print_info "Installing: ${packages_to_install[*]}"
    npm install -g "${packages_to_install[@]}"
    print_success "Global packages installed"
fi

echo ""

# Create environment files
echo "📝 Creating environment files..."
echo "================================="

# Backend .env.example
if [ ! -f "backend/.env.example" ]; then
    cat > backend/.env.example << 'EOF'
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=eemb_cms
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=false

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# Frontend
FRONTEND_URL=http://localhost:3000
EOF
    print_success "Created backend/.env.example"
else
    print_info "backend/.env.example already exists"
fi

# Frontend .env.local.example
if [ ! -f "frontend/.env.local.example" ]; then
    cat > frontend/.env.local.example << 'EOF'
# API
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_API_TOKEN=your-public-api-token

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
EOF
    print_success "Created frontend/.env.local.example"
else
    print_info "frontend/.env.local.example already exists"
fi

echo ""

# Set up Git hooks
echo "🔗 Setting up Git hooks..."
echo "=========================="

# Create pre-commit hook
if [ ! -f ".git/hooks/pre-commit" ]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run tests before commit

echo "Running pre-commit checks..."

# Run frontend tests if files changed
if git diff --cached --name-only | grep -q "^frontend/"; then
    echo "Running frontend tests..."
    cd frontend && npm run lint && npm run type-check
    if [ $? -ne 0 ]; then
        echo "Frontend tests failed. Commit aborted."
        exit 1
    fi
    cd ..
fi

# Run backend tests if files changed
if git diff --cached --name-only | grep -q "^backend/"; then
    echo "Running backend tests..."
    cd backend && npm run test
    if [ $? -ne 0 ]; then
        echo "Backend tests failed. Commit aborted."
        exit 1
    fi
    cd ..
fi

echo "Pre-commit checks passed!"
EOF
    chmod +x .git/hooks/pre-commit
    print_success "Created Git pre-commit hook"
else
    print_info "Git hooks already configured"
fi

echo ""

# Check for VS Code and install extensions
if command -v code &> /dev/null; then
    echo "📝 VS Code detected. Installing recommended extensions..."
    echo "========================================================="

    extensions=(
        "dbaeumer.vscode-eslint"
        "esbenp.prettier-vscode"
        "bradlc.vscode-tailwindcss"
        "prisma.prisma"
        "formulahendry.auto-rename-tag"
        "christian-kohler.npm-intellisense"
        "mikestead.dotenv"
    )

    for ext in "${extensions[@]}"; do
        code --install-extension "$ext" &> /dev/null
        print_success "Installed $ext"
    done
else
    print_info "VS Code not detected. Skipping extension installation."
fi

echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! 🎉                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Copy environment files and add your credentials:"
echo "   cp backend/.env.example backend/.env"
echo "   cp frontend/.env.local.example frontend/.env.local"
echo ""
echo "2. Initialize Strapi backend (Week 1):"
echo "   cd backend && ./init-strapi.sh"
echo ""
echo "3. Create Next.js frontend (Week 4):"
echo "   cd frontend && npx create-next-app@latest . --typescript --tailwind --app"
echo ""
echo "4. Import scraped data (after scraping completes):"
echo "   python3 scripts/data-import/import_faculty.py"
echo ""
echo "📖 Documentation:"
echo "================="
echo "- Project overview: README.md"
echo "- Development guide: PROJECT_CONTEXT.md"
echo "- Session management: CLAUDE_SESSION_GUIDE.md"
echo "- Progress tracking: PROGRESS_TRACKER.md"
echo ""
echo "🚀 Ready to build the EEMB website!"