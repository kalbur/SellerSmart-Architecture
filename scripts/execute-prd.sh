#!/bin/bash

# SellerSmart PRD Execution Script
# Handles single or multiple PRDs with comprehensive testing

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [[ ! -f "CLAUDE.md" ]]; then
    echo -e "${RED}Error: This script must be run from the SellerSmart-Architecture directory${NC}"
    echo "Please cd to /Users/kal/GitHub/SellerSmart-Architecture and try again"
    exit 1
fi

# Function to execute a single PRD
execute_prd() {
    local prd_id=$1
    
    echo -e "${CYAN}Opening Claude for $prd_id...${NC}"
    
    # Create a wrapper script that Claude will execute
    local wrapper_script="/tmp/claude_prd_${prd_id//[^a-zA-Z0-9]/_}.sh"
    
    # Write the wrapper script
    cat > "$wrapper_script" << EOF
#!/bin/bash
cd /Users/kal/GitHub/SellerSmart-Architecture

# Execute PRD with Claude
claude --dangerously-skip-permissions "You are in: /Users/kal/GitHub/SellerSmart-Architecture

## EXECUTING PRD: $prd_id

## TASK: Implement this PRD completely

1. Read the PRD: read_file('.prds/processing/$prd_id.md')
2. Update status to IN_PROGRESS
3. Navigate to affected service repositories
4. Create feature branches as needed
5. Implement all checklist items
6. Run all quality checks (lint, tests, build)
7. Mark items complete as you go: - [ ] → - [x]
8. Move PRD to completed when ALL items are done

## SERVICE REPOSITORIES
- /Users/kal/GitHub/SellerSmart-API
- /Users/kal/GitHub/SellerSmart-Web
- /Users/kal/GitHub/SellerSmart-Backend.BrandScan
- /Users/kal/GitHub/SellerSmart-Backend.InvOrders
- /Users/kal/GitHub/SellerSmart-Backend.RivalRadar
- /Users/kal/GitHub/SellerSmart-Backend.WholesaleScan
- /Users/kal/GitHub/SellerSmart-Backend.RapReview
- /Users/kal/GitHub/SellerSmart-SiteMonitor

## QUALITY CHECKS REQUIRED
- ESLint/Flake8 must pass
- TypeScript/MyPy must pass
- All tests must pass
- Build must succeed

Start by reading the PRD file."
EOF
    
    # Make the wrapper script executable
    chmod +x "$wrapper_script"
    
    # Open new terminal window to run the wrapper script
    osascript -e "tell application \"Terminal\"
        activate
        do script \"$wrapper_script\"
    end tell"
    
    echo -e "${GREEN}✓ Opened Claude for $prd_id${NC}"
    
    # Schedule cleanup of wrapper script after 5 seconds
    (sleep 5 && rm -f "$wrapper_script") &
}

# Main execution
echo -e "${GREEN}Starting SellerSmart PRD Execution${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Check if a specific PRD was provided
if [[ -n "$1" ]]; then
    # Single PRD execution
    PRD_ID="$1"
    
    # Check if PRD file exists
    if [[ ! -f ".prds/processing/$PRD_ID.md" ]]; then
        echo -e "${RED}Error: PRD file not found: .prds/processing/$PRD_ID.md${NC}"
        echo ""
        echo "Available PRDs in processing:"
        ls -1 .prds/processing/*.md 2>/dev/null | sed 's|.prds/processing/||' | sed 's|.md||' || echo "  No PRDs found"
        exit 1
    fi
    
    echo -e "${BLUE}Executing single PRD: $PRD_ID${NC}"
    execute_prd "$PRD_ID"
else
    # Multi-PRD execution - execute ALL PRDs in processing
    PRD_FILES=($(ls .prds/processing/*.md 2>/dev/null))
    
    if [[ ${#PRD_FILES[@]} -eq 0 ]]; then
        echo -e "${YELLOW}No PRDs found in processing directory${NC}"
        exit 0
    fi
    
    # Display found PRDs
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║              MULTI-PRD EXECUTION MODE                         ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${CYAN}Found ${#PRD_FILES[@]} PRD(s) to execute:${NC}"
    for prd_file in "${PRD_FILES[@]}"; do
        prd_id=$(basename "$prd_file" .md)
        echo -e "  ${YELLOW}• $prd_id${NC}"
    done
    
    echo -e "\n${CYAN}Opening separate Claude terminals for each PRD...${NC}"
    
    # Execute each PRD in its own terminal
    for prd_file in "${PRD_FILES[@]}"; do
        prd_id=$(basename "$prd_file" .md)
        execute_prd "$prd_id"
        # Small delay to prevent terminal overlap
        sleep 0.5
    done
    
    echo -e "\n${GREEN}✓ All PRDs are now being executed in separate terminals${NC}"
    echo -e "${YELLOW}Each Claude instance will:${NC}"
    echo -e "  • Read and analyze its PRD"
    echo -e "  • Implement all requirements"
    echo -e "  • Run all tests and linting"
    echo -e "  • Fix any issues before completion"
    echo -e "  • Mark checklist items as complete"
    echo -e "  • Move PRD to completed when done"
    echo -e "${CYAN}Note: Temporary wrapper scripts will be cleaned up automatically${NC}"
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PRD execution process initiated!${NC}"
