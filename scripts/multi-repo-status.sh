#!/bin/bash

# SellerSmart Multi-Repo Status & Smart Commit Script
# Checks all repos and can use Claude to handle commits with error fixing

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Base directory for all repos
BASE_DIR="/Users/kal/GitHub"

# List of all SellerSmart repositories
REPOS=(
    "SellerSmart-Architecture"
    "SellerSmart-API"
    "SellerSmart-Web"
    "SellerSmart-Backend.BrandScan"
    "SellerSmart-Backend.InvOrders"
    "SellerSmart-Backend.RivalRadar"
    "SellerSmart-Backend.WholesaleScan"
    "SellerSmart-SiteMonitor"
)

# Arrays to track repo states
REPOS_WITH_CHANGES=()
REPOS_CLEAN=()
REPOS_MISSING=()
REPOS_ERRORS=()

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Function to check a single repository
check_repo() {
    local repo=$1
    local repo_path="$BASE_DIR/$repo"
    
    if [[ ! -d "$repo_path" ]]; then
        REPOS_MISSING+=("$repo")
        return
    fi
    
    cd "$repo_path" 2>/dev/null || {
        REPOS_ERRORS+=("$repo - Cannot access directory")
        return
    }
    
    # Check if it's a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        REPOS_ERRORS+=("$repo - Not a git repository")
        return
    fi
    
    # Get branch and status
    local branch=$(git branch --show-current)
    local status=$(git status --porcelain)
    
    if [[ -n "$status" ]]; then
        # Count changes
        local modified=$(echo "$status" | grep -c "^ M")
        local added=$(echo "$status" | grep -c "^A")
        local deleted=$(echo "$status" | grep -c "^ D")
        local untracked=$(echo "$status" | grep -c "^??")
        
        local change_summary="$repo|$branch|M:$modified A:$added D:$deleted U:$untracked"
        REPOS_WITH_CHANGES+=("$change_summary")
    else
        REPOS_CLEAN+=("$repo|$branch")
    fi
}
# Function to display repository status
display_status() {
    print_header "SellerSmart Repository Status Check"
    echo -e "${CYAN}Checking all repositories...${NC}\n"
    
    # Check each repository
    for repo in "${REPOS[@]}"; do
        echo -ne "${YELLOW}Checking $repo...${NC}"
        check_repo "$repo"
        echo -e " ${GREEN}✓${NC}"
    done
    
    # Display results
    echo ""
    if [[ ${#REPOS_WITH_CHANGES[@]} -gt 0 ]]; then
        echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║          REPOSITORIES WITH UNCOMMITTED CHANGES                ║${NC}"
        echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        printf "${YELLOW}%-35s %-15s %s${NC}\n" "Repository" "Branch" "Changes"
        printf "${YELLOW}%-35s %-15s %s${NC}\n" "─────────────────────────────────" "──────────────" "───────────────────"
        
        for repo_info in "${REPOS_WITH_CHANGES[@]}"; do
            IFS='|' read -r repo branch changes <<< "$repo_info"
            printf "${RED}%-35s${NC} ${CYAN}%-15s${NC} ${YELLOW}%s${NC}\n" "$repo" "$branch" "$changes"
        done
        echo ""
    fi
    
    if [[ ${#REPOS_CLEAN[@]} -gt 0 ]]; then
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                    CLEAN REPOSITORIES                         ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        printf "${GREEN}%-35s %-15s${NC}\n" "Repository" "Branch"
        printf "${GREEN}%-35s %-15s${NC}\n" "─────────────────────────────────" "──────────────"
        
        for repo_info in "${REPOS_CLEAN[@]}"; do
            IFS='|' read -r repo branch <<< "$repo_info"
            printf "${GREEN}%-35s %-15s${NC}\n" "$repo" "$branch"
        done
        echo ""
    fi
    
    if [[ ${#REPOS_MISSING[@]} -gt 0 ]]; then
        echo -e "${PURPLE}Missing repositories:${NC}"
        for repo in "${REPOS_MISSING[@]}"; do
            echo -e "  ${PURPLE}• $repo${NC}"
        done
        echo ""
    fi
    
    if [[ ${#REPOS_ERRORS[@]} -gt 0 ]]; then
        echo -e "${RED}Repositories with errors:${NC}"
        for error in "${REPOS_ERRORS[@]}"; do
            echo -e "  ${RED}• $error${NC}"
        done
        echo ""
    fi
}
# Function to show detailed changes for a repository
show_repo_details() {
    local repo=$1
    local repo_path="$BASE_DIR/$repo"
    
    cd "$repo_path" || return
    
    echo -e "\n${CYAN}═══ $repo ═══${NC}"
    echo -e "${YELLOW}Branch:${NC} $(git branch --show-current)"
    echo -e "${YELLOW}Changes:${NC}"
    git status --short
}

# Function to commit and push a repository using Claude
commit_repo_with_claude() {
    local repo=$1
    local repo_path="$BASE_DIR/$repo"
    local wait_for_ci=$2
    
    echo -e "\n${CYAN}Opening Claude for $repo...${NC}"
    
    # Add CI monitoring instructions if requested
    local ci_instructions=""
    if [[ "$wait_for_ci" == "true" ]]; then
        ci_instructions="

## CI/CD MONITORING (ENABLED)
After pushing all commits:
1. Monitor the CI/CD pipeline status
2. If CI fails:
   - Analyze the error logs
   - Fix the issues locally
   - Create a new commit with the fixes
   - Push again
   - Repeat until CI passes
3. Common CI failures to watch for:
   - Build errors
   - Test failures
   - Coverage drops
   - Linting issues in files you didn't edit
   - Integration test failures
4. Use these commands to check CI status:
   - GitHub: Check Actions tab or use 'gh run list'
   - GitLab: Check Pipelines or use 'glab pipeline list'
   - Or wait for status checks on the PR

IMPORTANT: Do not close this terminal until CI passes!"
    fi
    
    # Create Claude prompt for this specific repo
    local prompt="# COMMIT AND PUSH CHANGES FOR $repo

## CURRENT LOCATION
You are in: $repo_path

## IMPORTANT: ATOMIC COMMITS STRATEGY
Instead of committing all changes at once, create separate commits for different concerns:
1. Group related changes together
2. Each commit should have a single, clear purpose
3. Use descriptive commit messages that explain WHAT and WHY

## WORKFLOW FOR ATOMIC COMMITS
1. First, check all changes: git status -s
2. Review changes in detail: git diff
3. Identify logical groups of changes (e.g., bug fixes, new features, refactoring, tests)
4. For each logical group:
   - Stage only related files: git add <specific files>
   - Create descriptive commit: git commit -m \"type: description\"
   - Repeat for next group

## COMMIT MESSAGE FORMAT
Use conventional commits format:
- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting, missing semicolons, etc
- refactor: code restructuring
- test: adding tests
- chore: maintenance tasks

Example of splitting commits:
- git add src/components/UserProfile.tsx src/components/UserProfile.test.tsx
- git commit -m \"feat: add user profile component with avatar support\"
- git add src/api/auth.ts src/types/auth.ts
- git commit -m \"fix: resolve authentication token refresh issue\"
- git add README.md docs/API.md
- git commit -m \"docs: update API documentation with new endpoints\"

## REQUIREMENTS
1. NEVER use --no-verify or bypass pre-commit hooks
2. If pre-commit hooks fail:
   - Fix ALL issues that caused the failure
   - Do not proceed until all checks pass
   - Re-stage fixed files and commit again
3. After all commits, push to remote
4. If push fails due to no upstream: git push --set-upstream origin \$(git branch --show-current)

## STEP-BY-STEP PROCESS
1. cd $repo_path
2. git status -s (see all changes)
3. git diff (review changes in detail)
4. Identify logical groups of changes
5. For each group:
   - git add <specific related files>
   - git commit -m \"type: descriptive message\"
   - If hooks fail, fix issues and retry
6. After all commits: git push
$ci_instructions

## IMPORTANT REMINDERS
- One commit per concern (don't mix features with fixes)
- Descriptive messages (not \"fix stuff\" or \"updates\")
- Include context in commit messages
- Fix all linting/type/test errors before committing
- Each commit should pass all quality checks

Start by checking the current status and analyzing what changes can be grouped together."
    
    # Open new terminal window with Claude
    osascript -e "tell application \"Terminal\"
        activate
        set newWindow to do script \"cd $repo_path && claude --dangerously-skip-permissions \\\"$prompt\\\"\"
        set custom title of newWindow to \\\"Committing: $repo\\\"
    end tell"
    
    echo -e "${GREEN}✓ Opened Claude for $repo${NC}"
}

# Function for quick commit-all using Claude
quick_commit_with_claude() {
    local repo=$1
    local repo_path="$BASE_DIR/$repo"
    local wait_for_ci=$2
    
    echo -e "\n${CYAN}Opening Claude for quick commit in $repo...${NC}"
    
    # Add CI monitoring instructions if requested
    local ci_instructions=""
    if [[ "$wait_for_ci" == "true" ]]; then
        ci_instructions="
        
## CI/CD MONITORING (ENABLED)
After pushing:
1. Monitor CI status
2. Fix any failures and push fixes
3. Repeat until CI passes"
    fi
    
    local prompt="# QUICK COMMIT ALL CHANGES FOR $repo

## CURRENT LOCATION
You are in: $repo_path

## QUICK COMMIT MODE
This is for when all changes are related and can be committed together.

## WORKFLOW
1. cd $repo_path
2. git status
3. Review all changes
4. git add -A
5. Create ONE descriptive commit message that summarizes all changes
6. git commit -m \"type: comprehensive description of all changes\"
7. If pre-commit hooks fail:
   - Fix ALL issues
   - Commit again
8. git push$ci_instructions

## IMPORTANT
- Still create a good commit message
- NEVER use --no-verify
- Fix all hook failures before proceeding

Start by checking status and creating an appropriate commit message."
    
    # Open new terminal window with Claude
    osascript -e "tell application \"Terminal\"
        activate
        set newWindow to do script \"cd $repo_path && claude --dangerously-skip-permissions \\\"$prompt\\\"\"
        set custom title of newWindow to \\\"Quick Commit: $repo\\\"
    end tell"
    
    echo -e "${GREEN}✓ Opened Claude for quick commit in $repo${NC}"
}
# Function to commit all repos with changes using Claude
commit_all_repos_with_claude() {
    local wait_for_ci=$1
    echo -e "\n${CYAN}Opening Claude terminals for all repositories with changes...${NC}"
    
    for repo_info in "${REPOS_WITH_CHANGES[@]}"; do
        IFS='|' read -r repo _ _ <<< "$repo_info"
        commit_repo_with_claude "$repo" "$wait_for_ci"
        # Small delay to prevent terminal window overlap
        sleep 0.5
    done
    
    echo -e "\n${GREEN}✓ Opened Claude for all repositories with changes${NC}"
    echo -e "${YELLOW}Claude will handle commits and ensure all quality checks pass.${NC}"
    echo -e "${YELLOW}Each repository is in its own terminal window.${NC}"
    
    if [[ "$wait_for_ci" == "true" ]]; then
        echo -e "${PURPLE}CI monitoring is ENABLED - Claude will wait for CI to pass${NC}"
    fi
}

# Main execution
clear
print_header "SellerSmart Multi-Repository Manager"

# Display status
display_status

# If there are repos with changes, offer to process them
if [[ ${#REPOS_WITH_CHANGES[@]} -gt 0 ]]; then
    echo -e "\n${YELLOW}Would you like to:${NC}"
    echo -e "  ${CYAN}1)${NC} View detailed changes for each repository"
    echo -e "  ${CYAN}2)${NC} Use Claude for atomic commits (best practice)"
    echo -e "  ${CYAN}3)${NC} Use Claude for quick commit-all (one commit per repo)"
    echo -e "  ${CYAN}4)${NC} Exit"
    echo -ne "\n${YELLOW}Select option (1-4):${NC} "
    read -r option
    
    case $option in
        1)
            for repo_info in "${REPOS_WITH_CHANGES[@]}"; do
                IFS='|' read -r repo _ _ <<< "$repo_info"
                show_repo_details "$repo"
            done
            ;;
        2)
            echo -e "\n${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${PURPLE}║              CLAUDE AUTOMATED COMMIT MODE                     ║${NC}"
            echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
            echo -e "\n${CYAN}Claude will:${NC}"
            echo -e "  • Review all changes and group them by concern"
            echo -e "  • Create multiple atomic commits (one per feature/fix)"
            echo -e "  • Write descriptive commit messages for each change"
            echo -e "  • Fix any linting, formatting, or type errors"
            echo -e "  • Ensure all pre-commit hooks pass"
            echo -e "  • Never bypass quality checks"
            echo -e "  • Push changes after successful commits"
            echo -e "\n${YELLOW}Benefits:${NC}"
            echo -e "  • Clean git history with meaningful commits"
            echo -e "  • Easy to review and revert specific changes"
            echo -e "  • Better collaboration and code understanding"
            
            echo -e "\n${YELLOW}Would you like Claude to monitor CI/CD after pushing? (y/n):${NC}"
            read -r ci_monitor
            
            local wait_for_ci="false"
            if [[ "$ci_monitor" == "y" ]]; then
                wait_for_ci="true"
                echo -e "${GREEN}✓ CI monitoring enabled - Claude will wait for CI to pass${NC}"
                echo -e "${YELLOW}Claude will fix any CI failures and push fixes${NC}"
            fi
            
            echo -e "\n${YELLOW}Process specific repos or all? (all/select):${NC}"
            read -r process_choice
            
            if [[ "$process_choice" == "all" ]]; then
                commit_all_repos_with_claude "$wait_for_ci"
            else
                echo -e "\n${YELLOW}Select repositories to process:${NC}"
                for i in "${!REPOS_WITH_CHANGES[@]}"; do
                    IFS='|' read -r repo _ _ <<< "${REPOS_WITH_CHANGES[$i]}"
                    echo -e "  ${CYAN}$((i+1)))${NC} $repo"
                done
                echo -e "\n${YELLOW}Enter numbers separated by spaces (e.g., 1 3 5):${NC}"
                read -ra selections
                
                for selection in "${selections[@]}"; do
                    if [[ $selection -gt 0 ]] && [[ $selection -le ${#REPOS_WITH_CHANGES[@]} ]]; then
                        IFS='|' read -r repo _ _ <<< "${REPOS_WITH_CHANGES[$((selection-1))]}"
                        commit_repo_with_claude "$repo" "$wait_for_ci"
                        sleep 0.5
                    fi
                done
            fi
            ;;
        3)
            echo -e "\n${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
            echo -e "${PURPLE}║              CLAUDE QUICK COMMIT MODE                         ║${NC}"
            echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}"
            echo -e "\n${CYAN}Quick mode will:${NC}"
            echo -e "  • Commit ALL changes in ONE commit per repo"
            echo -e "  • Still fix any pre-commit hook failures"
            echo -e "  • Create descriptive commit messages"
            echo -e "  • Best for related changes or hotfixes"
            
            echo -e "\n${YELLOW}Would you like Claude to monitor CI/CD after pushing? (y/n):${NC}"
            read -r ci_monitor
            
            local wait_for_ci="false"
            if [[ "$ci_monitor" == "y" ]]; then
                wait_for_ci="true"
                echo -e "${GREEN}✓ CI monitoring enabled${NC}"
            fi
            
            echo -e "\n${YELLOW}Quick commit all repos with changes? (y/n):${NC}"
            read -r confirm_quick
            
            if [[ "$confirm_quick" == "y" ]]; then
                for repo_info in "${REPOS_WITH_CHANGES[@]}"; do
                    IFS='|' read -r repo _ _ <<< "$repo_info"
                    quick_commit_with_claude "$repo" "$wait_for_ci"
                    sleep 0.5
                done
            fi
            ;;
        4)
            echo -e "${GREEN}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
else
    echo -e "\n${GREEN}All repositories are clean!${NC}"
fi

# Final status check
echo -e "\n${CYAN}Running final status check...${NC}"
REPOS_WITH_CHANGES=()
REPOS_CLEAN=()
for repo in "${REPOS[@]}"; do
    check_repo "$repo"
done

if [[ ${#REPOS_WITH_CHANGES[@]} -eq 0 ]]; then
    echo -e "${GREEN}✓ All repositories are now clean!${NC}"
else
    echo -e "${YELLOW}⚠ Some repositories still have uncommitted changes${NC}"
    echo -e "${CYAN}Check the Claude terminal windows for progress${NC}"
fi