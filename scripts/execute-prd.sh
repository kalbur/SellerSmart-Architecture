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

# Execute PRD with Claude - TDD WORKFLOW
claude --dangerously-skip-permissions "You are in: /Users/kal/GitHub/SellerSmart-Architecture

## EXECUTING PRD: $prd_id - TEST-DRIVEN DEVELOPMENT WORKFLOW

## TASK: Implement this PRD using strict TDD methodology

### TDD WORKFLOW (MANDATORY ORDER):
1. **Read PRD**: read_file('.prds/processing/$prd_id.md')
2. **Update status**: Mark as IN_PROGRESS
3. **Navigate**: Go to affected service repositories
4. **Create branches**: Create feature branches as needed

### PHASE 1: WRITE TESTS FIRST (NO IMPLEMENTATION YET)
5. **Write ALL tests first**:
   - Unit tests for all business logic
   - Integration tests for all endpoints
   - Component tests for UI elements
   - E2E tests for user flows
6. **Run tests to verify they FAIL**:
   - All tests MUST fail initially
   - This confirms tests are testing the right things
   - Document which tests are failing and why

### PHASE 2: IMPLEMENT WITH TDD CYCLE
7. **For each failing test**:
   - Write MINIMUM code to make test pass
   - Run test to verify it passes
   - Refactor if needed (keep test green)
   - Check coverage incrementally
8. **Coverage checks**:
   - Run coverage after each test passes
   - Aim for 100% coverage
   - Document any legitimate exclusions

### PHASE 3: QUALITY ASSURANCE
9. **Run all quality checks**:
   - ESLint/Flake8 must pass
   - TypeScript/MyPy must pass
   - All tests must pass
   - Coverage must be 100% (or documented exceptions)
   - Build must succeed
10. **Final verification**:
    - Run full test suite
    - Generate coverage report
    - Ensure no regressions

### PHASE 4: COMPLETION
11. **Documentation**:
    - Update README with test examples
    - Document how to run tests
    - Include coverage commands
12. **Mark complete**:
    - Update checklist items: - [ ] → - [x]
    - Move PRD to completed when ALL done

## SERVICE REPOSITORIES
- /Users/kal/GitHub/SellerSmart-API
- /Users/kal/GitHub/SellerSmart-Web
- /Users/kal/GitHub/SellerSmart-Backend.BrandScan
- /Users/kal/GitHub/SellerSmart-Backend.InvOrders
- /Users/kal/GitHub/SellerSmart-Backend.RivalRadar
- /Users/kal/GitHub/SellerSmart-Backend.WholesaleScan
- /Users/kal/GitHub/SellerSmart-Backend.RapReview
- /Users/kal/GitHub/SellerSmart-SiteMonitor

## TEST COMMANDS BY SERVICE TYPE
### Python Services (pytest):
- Run tests: pytest
- With coverage: pytest --cov=. --cov-report=html --cov-report=term
- Coverage report: coverage report -m

### Node.js Services (Jest):
- Run tests: npm test
- With coverage: npm run test:coverage
- Watch mode: npm run test:watch

### React Components:
- Run tests: npm test
- Coverage: npm run test:coverage
- Component tests: npm run test:components

## IMPORTANT TDD RULES
1. NO implementation code until tests are written
2. Tests MUST fail before implementation
3. Write MINIMUM code to pass each test
4. Refactor only with green tests
5. 100% coverage is mandatory
6. Document any coverage exclusions

Start by reading the PRD file and understanding the test requirements."
EOF
    
    # Make the wrapper script executable
    chmod +x "$wrapper_script"
    
    # Open new Warp window to run the wrapper script
    osascript << EOF
tell application "Warp" to activate
delay 1
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 1
        keystroke "$wrapper_script"
        key code 36
    end tell
end tell
EOF
    
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
    echo -e "${YELLOW}Each Claude instance will follow TDD workflow:${NC}"
    echo -e "  ${CYAN}Phase 1: Test Writing${NC}"
    echo -e "    • Write ALL tests before any implementation"
    echo -e "    • Verify tests fail correctly"
    echo -e "  ${CYAN}Phase 2: Implementation${NC}"
    echo -e "    • Write minimum code to pass each test"
    echo -e "    • Refactor with green tests"
    echo -e "  ${CYAN}Phase 3: Quality${NC}"
    echo -e "    • Run all linting and type checks"
    echo -e "    • Verify 100% test coverage"
    echo -e "  ${CYAN}Phase 4: Completion${NC}"
    echo -e "    • Update documentation"
    echo -e "    • Mark checklist items complete"
    echo -e "    • Move PRD to completed"
    echo -e "${CYAN}Note: Temporary wrapper scripts will be cleaned up automatically${NC}"
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}PRD execution process initiated!${NC}"
