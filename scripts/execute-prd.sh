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
    
    # Create a temporary file for the prompt
    local temp_prompt="/tmp/prd_prompt_${prd_id}.txt"
    
    # Write the prompt to the temp file
    cat > "$temp_prompt" << 'EOF'
# CLAUDE CODE EXECUTION PHASE

## CURRENT LOCATION
You are in: /Users/kal/GitHub/SellerSmart-Architecture

## EXECUTING PRD
PRD ID: PRD_ID_PLACEHOLDER

## SERVICE REPOSITORIES
All services are located at: /Users/kal/GitHub/
- SellerSmart-API
- SellerSmart-Web
- SellerSmart-Backend.BrandScan
- SellerSmart-Backend.InvOrders
- SellerSmart-Backend.RivalRadar
- SellerSmart-Backend.WholesaleScan
- SellerSmart-SiteMonitor

## REQUIREMENTS  
- Implement according to specific PRD: PRD_ID_PLACEHOLDER
- Read CLAUDE.md for project context (in current directory)
- Check off PRD items as completed
- NO new features without updating PRD
- Follow codebase analysis and examples from PRD
- ENSURE COMPLETE IMPLEMENTATION - nothing left unfinished

## SETUP
1. Find and read PRD file:
   ```
   list_directory(".prds/processing")
   read_file(".prds/processing/PRD_ID_PLACEHOLDER.md")
   ```
2. Update PRD status: PLANNING_COMPLETE → IN_PROGRESS
3. Review codebase analysis section for implementation guidance
4. Identify which service repositories need changes

## IMPLEMENTATION WORKFLOW
1. **Review PRD thoroughly**
   - Read codebase analysis section
   - Note which services are affected
   - Review code examples to follow

2. **Navigate to affected services**
   - Use `cd /Users/kal/GitHub/SellerSmart-{service}` for each service
   - Create feature branch if on main/master

3. **Create comprehensive tests first**
   - Follow test patterns identified in PRD
   - Write tests before implementation

4. **Implement following PRD checklist**
   - Use code examples and patterns from PRD
   - Maintain consistency with existing code
   - Mark items complete: - [ ] → - [x]

5. **Verify implementation**
   - ALL checklist items must be marked [x]
   - No TODO, FIXME, or incomplete code
   - All tests pass
   - Verify against success criteria

## QUALITY ASSURANCE BEFORE COMPLETION
Before marking PRD as complete, you MUST run and pass:

### For JavaScript/TypeScript projects:
- ESLint: `npm run lint` or `yarn lint`
- TypeScript: `npx tsc --noEmit` (if TypeScript project)
- Tests: `npm test` or `yarn test`
- Build: `npm run build` or `yarn build`

### For Python projects:
- Black: `black .` (formatting)
- Flake8: `flake8` (linting)
- MyPy: `mypy .` (type checking)
- Pytest: `pytest` (tests)

### General checks:
- No console.log statements in production code
- No commented out code
- All imports are used
- No hardcoded values that should be config
- API keys/secrets are in environment variables

If ANY of these checks fail:
1. Fix all issues
2. Re-run the checks
3. Only proceed when ALL checks pass

## CROSS-SERVICE CONSIDERATIONS
- If PRD affects multiple services, implement in order:
  1. Backend services first (API, microservices)
  2. Frontend (Web) last
- Ensure API contracts match between services
- Update documentation in each service

## COMPLETION CHECKLIST
- [ ] All PRD checklist items marked complete
- [ ] All tests written and passing
- [ ] ESLint/Flake8 passing with no errors
- [ ] TypeScript/MyPy passing with no errors
- [ ] Build succeeds without warnings
- [ ] No incomplete implementations
- [ ] Documentation updated
- [ ] Code follows conventions from CONVENTIONS.md
- [ ] PRD status updated to COMPLETED
- [ ] PRD moved to completed folder

## FINAL STEPS
1. Run all quality checks one final time
2. Update PRD status to COMPLETED
3. Move PRD: `move_file(".prds/processing/PRD_ID_PLACEHOLDER.md", ".prds/completed/PRD_ID_PLACEHOLDER_COMPLETED.md")`
4. Add all changes to git in each affected repository
5. Print "IMPLEMENTATION COMPLETE - PRD ID: PRD_ID_PLACEHOLDER - ALL ITEMS FINISHED"
6. Generate detailed PR description for each affected repository

## IMPORTANT REMINDERS
- Work from the SellerSmart-Architecture directory
- Navigate to service directories as needed
- Follow the patterns and examples in the PRD
- Complete ALL items - no partial implementations
- NEVER mark PRD complete until all tests/linting pass
EOF
    
    # Replace the placeholder with actual PRD ID
    sed -i '' "s/PRD_ID_PLACEHOLDER/$prd_id/g" "$temp_prompt"
    
    # Read the prompt content and escape it properly for shell
    local prompt_content=$(cat "$temp_prompt" | sed "s/'/'\\\\''/g")
    
    # Open new terminal window with Claude
    osascript -e "tell application \"Terminal\"
        activate
        do script \"cd /Users/kal/GitHub/SellerSmart-Architecture && claude --dangerously-skip-permissions '$prompt_content' && rm $temp_prompt\"
    end tell"
    
    echo -e "${GREEN}✓ Opened Claude for $prd_id${NC}"
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
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PRD execution process initiated!${NC}"
