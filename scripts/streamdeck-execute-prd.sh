#!/bin/bash
# Stream Deck launcher for PRD execution
# Opens Terminal and runs the PRD execution script
# If no PRD_ID provided, executes ALL PRDs in processing

# Check if PRD_ID was provided as argument
if [ -n "$1" ]; then
    PRD_ID="$1"
    osascript -e "tell application \"Terminal\"
        activate
        do script \"cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh $PRD_ID\"
    end tell"
else
    # No PRD_ID provided, execute all PRDs
    osascript -e 'tell application "Terminal"
        activate
        do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh"
    end tell'
fi
