#!/bin/bash

# Nocturne POS Integration Helper Script
# This script assists with integrating the nocturne-pos repository into JV

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
JV_REPO_PATH="/home/runner/work/JV/JV"
NOCTURNE_TARGET_PATH="$JV_REPO_PATH/src/frontend/pages/NocturnePOS"
INTEGRATION_BRANCH="integrate-nocturne-pos"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Nocturne POS Integration Helper for JV Repository${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Function to print step
print_step() {
    echo -e "${GREEN}▶ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Check if we're in the JV repository
if [ ! -d "$JV_REPO_PATH/.git" ]; then
    print_error "Not in JV repository. Please cd to $JV_REPO_PATH"
    exit 1
fi

cd "$JV_REPO_PATH"

# Main menu
echo "Please select integration method:"
echo ""
echo "  1) Git Submodule (Recommended)"
echo "     - Keeps nocturne-pos as a separate repository"
echo "     - Easy to update when nocturne-pos changes"
echo "     - Better for ongoing development"
echo ""
echo "  2) Direct Copy"
echo "     - Copies nocturne-pos files directly into JV"
echo "     - Simpler structure"
echo "     - Better for one-time integration"
echo ""
echo "  3) Check Current Status"
echo "     - Verify integration setup"
echo "     - Check branch status"
echo ""
echo "  4) Exit"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        print_step "Starting Git Submodule Integration..."
        echo ""
        
        # Check if already a submodule
        if [ -f "$NOCTURNE_TARGET_PATH/.git" ] || grep -q "NocturnePOS" .gitmodules 2>/dev/null; then
            print_warning "Nocturne POS submodule already exists!"
            read -p "Remove and re-add? (y/N): " confirm
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                print_step "Removing existing submodule..."
                git submodule deinit -f "$NOCTURNE_TARGET_PATH" 2>/dev/null || true
                git rm -f "$NOCTURNE_TARGET_PATH" 2>/dev/null || true
                rm -rf ".git/modules/src/frontend/pages/NocturnePOS" 2>/dev/null || true
            else
                exit 0
            fi
        fi
        
        # Get nocturne-pos URL
        read -p "Enter nocturne-pos repository URL [https://github.com/ezik3/nocturne-pos.git]: " repo_url
        repo_url=${repo_url:-https://github.com/ezik3/nocturne-pos.git}
        
        # Checkout integration branch
        print_step "Switching to $INTEGRATION_BRANCH branch..."
        git checkout "$INTEGRATION_BRANCH" 2>/dev/null || git checkout -b "$INTEGRATION_BRANCH"
        
        # Add submodule
        print_step "Adding nocturne-pos as git submodule..."
        git submodule add "$repo_url" "$NOCTURNE_TARGET_PATH"
        
        # Initialize and update
        print_step "Initializing submodule..."
        git submodule update --init --recursive
        
        print_success "Git submodule added successfully!"
        echo ""
        print_step "Next steps:"
        echo "  1. Update POSAdapter.jsx import (see NOCTURNE_INTEGRATION.md)"
        echo "  2. Update posConfig.js to set ACTIVE_POS_SYSTEM = POS_SYSTEMS.NOCTURNE"
        echo "  3. Test with: wasp start"
        echo "  4. Commit: git add . && git commit -m 'Integrate nocturne-pos as submodule'"
        ;;
        
    2)
        print_step "Starting Direct Copy Integration..."
        echo ""
        
        # Check if directory exists
        if [ -d "$NOCTURNE_TARGET_PATH" ] && [ "$(ls -A $NOCTURNE_TARGET_PATH 2>/dev/null | grep -v README.md)" ]; then
            print_warning "NocturnePOS directory already has files!"
            read -p "Overwrite? (y/N): " confirm
            if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
                exit 0
            fi
        fi
        
        # Get source path
        read -p "Enter path to nocturne-pos clone (e.g., /tmp/nocturne-pos): " source_path
        
        if [ ! -d "$source_path" ]; then
            print_error "Source path not found: $source_path"
            exit 1
        fi
        
        # Checkout integration branch
        print_step "Switching to $INTEGRATION_BRANCH branch..."
        git checkout "$INTEGRATION_BRANCH" 2>/dev/null || git checkout -b "$INTEGRATION_BRANCH"
        
        # Create target directory
        mkdir -p "$NOCTURNE_TARGET_PATH"
        
        # Copy files
        print_step "Copying nocturne-pos files..."
        
        # Detect source structure and copy accordingly
        if [ -d "$source_path/src" ]; then
            cp -r "$source_path/src/"* "$NOCTURNE_TARGET_PATH/"
        else
            cp -r "$source_path/"* "$NOCTURNE_TARGET_PATH/"
        fi
        
        print_success "Files copied successfully!"
        echo ""
        print_step "Files copied to: $NOCTURNE_TARGET_PATH"
        print_step "Next steps:"
        echo "  1. Update POSAdapter.jsx import (see NOCTURNE_INTEGRATION.md)"
        echo "  2. Update posConfig.js to set ACTIVE_POS_SYSTEM = POS_SYSTEMS.NOCTURNE"
        echo "  3. Test with: wasp start"
        echo "  4. Commit: git add . && git commit -m 'Import nocturne-pos files'"
        ;;
        
    3)
        print_step "Checking Integration Status..."
        echo ""
        
        # Check branch
        current_branch=$(git branch --show-current)
        echo "Current Branch: $current_branch"
        
        if [ "$current_branch" = "$INTEGRATION_BRANCH" ]; then
            print_success "On integration branch ✓"
        else
            print_warning "Not on integration branch (currently on: $current_branch)"
        fi
        echo ""
        
        # Check if NocturnePOS exists
        if [ -d "$NOCTURNE_TARGET_PATH" ]; then
            file_count=$(find "$NOCTURNE_TARGET_PATH" -type f ! -name "README.md" | wc -l)
            echo "NocturnePOS Directory: EXISTS"
            echo "Files (excluding README): $file_count"
            
            if [ "$file_count" -gt 0 ]; then
                print_success "Nocturne POS files are present ✓"
                
                # Check if it's a submodule
                if grep -q "NocturnePOS" .gitmodules 2>/dev/null; then
                    print_success "Configured as git submodule ✓"
                else
                    echo "Integration Type: Direct Copy"
                fi
            else
                print_warning "Nocturne POS not yet integrated"
            fi
        else
            print_warning "NocturnePOS directory does not exist"
        fi
        echo ""
        
        # Check POSAdapter
        if grep -q "import.*NocturnePOS" "$JV_REPO_PATH/src/frontend/pages/POS/POSAdapter.jsx" 2>/dev/null; then
            print_success "POSAdapter.jsx is updated ✓"
        else
            print_warning "POSAdapter.jsx needs import update"
        fi
        
        # Check posConfig
        if grep -q "ACTIVE_POS_SYSTEM.*NOCTURNE" "$JV_REPO_PATH/src/frontend/pages/POS/config/posConfig.js" 2>/dev/null; then
            print_success "posConfig.js set to use Nocturne POS ✓"
        else
            echo "Active POS System: $(grep "ACTIVE_POS_SYSTEM = " "$JV_REPO_PATH/src/frontend/pages/POS/config/posConfig.js" || echo "Unknown")"
        fi
        echo ""
        
        print_step "Integration Documentation:"
        echo "  - INTEGRATION_GUIDE.md (comprehensive guide)"
        echo "  - NOCTURNE_INTEGRATION.md (quick start)"
        echo "  - IMPLEMENTATION_SUMMARY.md (what was done)"
        ;;
        
    4)
        print_step "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_success "Integration helper completed!"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
