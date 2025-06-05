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
    
    echo -e "\n${CYAN}Opening Claude for $repo...${NC}"
    
    # Create Claude prompt for this specific repo
    local prompt="# COMMIT AND PUSH CHANGES FOR $repo

## CURRENT LOCATION
You are in: $repo_path

## REQUIREMENTS
1. First, check current status with: git status
2. Review all changes carefully
3. Add all changes with: git add -A
4. Create a descriptive commit message based on the changes
5. IMPORTANT: NEVER use --no-verify or bypass pre-commit hooks
6. If pre-commit hooks fail (ESLint, Prettier, TypeScript, tests):
   - Fix ALL issues that caused the failure
   - Do not proceed until all checks pass
   - Run the commit again after fixing
7. After successful commit, push to remote
8. If push fails due to no upstream, use: git push --set-upstream origin \$(git branch --show-current)

## WORKFLOW
1. cd $repo_path
2. git status
3. Review changes and create appropriate commit message
4. git add -A
5. git commit -m \"your descriptive message\"
6. If commit fails due to hooks:
   - Read the error output carefully
   - Fix all issues (linting, formatting, types, tests)
   - Try commit again
   - REPEAT until all checks pass
7. git push (or git push --set-upstream origin branch-name if needed)

## IMPORTANT REMINDERS
- NEVER bypass pre-commit hooks with --no-verify
- Fix all linting errors
- Fix all TypeScript errors
- Fix all test failures
- Ensure code formatting is correct
- The commit should only succeed when ALL quality checks pass

Start by checking the current status of the repository."
    
    # Open new terminal window with Claude
    osascript -e "tell application \"Terminal\"
        activate
        set newWindow to do script \"cd $repo_path && claude --dangerously-skip-permissions \\\"$prompt\\\"\"
        set custom title of newWindow to \\\"Committing: $repo\\\"
    end tell"
    
    echo -e "${GREEN}✓ Opened Claude for $repo${NC}"
}
# Function to commit all repos with changes using Claude
commit_all_repos_with_claude() {
    echo -e "\n${CYAN}Opening Claude terminals for all repositories with changes...${NC}"
    
    for repo_info in "${REPOS_WITH_CHANGES[@]}"; do
        IFS='|' read -r repo _ _ <<< "$repo_info"
        commit_repo_with_claude "$repo"
        # Small delay to prevent terminal window overlap
        sleep 0.5
    done
    
    echo -e "\n${GREEN}✓ Opened Claude for all repositories with changes${NC}"
    echo -e "${YELLOW}Claude will handle commits and ensure all quality checks pass.${NC}"
    echo -e "${YELLOW}Each repository is in its own terminal window.${NC}"
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
    echo -e "  ${CYAN}2)${NC} Use Claude to commit and push (handles all errors automatically)"
    echo -e "  ${CYAN}3)${NC} Exit"
    echo -ne "\n${YELLOW}Select option (1-3):${NC} "
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
            echo -e "  • Review all changes in each repository"
            echo -e "  • Create appropriate commit messages"
            echo -e "  • Fix any linting, formatting, or type errors"
            echo -e "  • Ensure all pre-commit hooks pass"
            echo -e "  • Never bypass quality checks"
            echo -e "  • Push changes after successful commits"
            
            echo -e "\n${YELLOW}Process specific repos or all? (all/select):${NC}"
            read -r process_choice
            
            if [[ "$process_choice" == "all" ]]; then
                commit_all_repos_with_claude
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
                        commit_repo_with_claude "$repo"
                        sleep 0.5
                    fi
                done
            fi
            ;;
        3)
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