#!/bin/bash

# Setup Pre-commit Hooks for EEMB Website
# This script installs and configures pre-commit hooks

set -e

echo "================================================"
echo "Setting up Pre-commit Hooks for EEMB Website"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version | cut -d " " -f 2 | cut -d "." -f 1,2)
REQUIRED_VERSION="3.11"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "⚠️  Warning: Python $PYTHON_VERSION detected. Python 3.11+ is recommended."
fi

# Install pre-commit if not already installed
echo "📦 Installing pre-commit..."
if ! command -v pre-commit &> /dev/null; then
    pip3 install pre-commit --user
    echo "✅ pre-commit installed"
else
    echo "✅ pre-commit is already installed"
    pre-commit --version
fi

# Install the pre-commit hooks
echo ""
echo "🔧 Installing pre-commit hooks..."
pre-commit install
pre-commit install --hook-type commit-msg
echo "✅ Pre-commit hooks installed"

# Create secrets baseline if it doesn't exist
if [ ! -f .secrets.baseline ]; then
    echo ""
    echo "🔐 Creating secrets baseline..."
    pip3 install detect-secrets --user
    detect-secrets scan > .secrets.baseline
    echo "✅ Secrets baseline created"
fi

# Install additional dependencies for hooks
echo ""
echo "📦 Installing additional dependencies..."

# Node.js dependencies for ESLint and Prettier
if command -v npm &> /dev/null; then
    echo "Installing Node.js linting tools..."
    npm install --save-dev \
        eslint \
        prettier \
        @typescript-eslint/parser \
        @typescript-eslint/eslint-plugin \
        eslint-config-next \
        markdownlint-cli
    echo "✅ Node.js tools installed"
else
    echo "⚠️  npm not found. Skipping Node.js tools installation."
fi

# Python linting tools
echo "Installing Python linting tools..."
pip3 install --user black flake8 isort
echo "✅ Python tools installed"

# Run pre-commit on all files to check setup
echo ""
echo "🧪 Testing pre-commit setup..."
pre-commit run --all-files || true

echo ""
echo "================================================"
echo "✅ Pre-commit setup complete!"
echo "================================================"
echo ""
echo "Pre-commit will now run automatically on:"
echo "  • Every git commit"
echo "  • Commit message validation"
echo ""
echo "Manual commands:"
echo "  • Run on all files: pre-commit run --all-files"
echo "  • Run specific hook: pre-commit run <hook-id>"
echo "  • Update hooks: pre-commit autoupdate"
echo "  • Skip hooks (emergency): git commit --no-verify"
echo ""
echo "⚠️  Note: First run may take longer as it downloads hook repositories."
echo ""