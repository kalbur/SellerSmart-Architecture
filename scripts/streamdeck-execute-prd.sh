#!/bin/bash
# Stream Deck launcher for PRD execution
# Opens Warp and runs the PRD execution script
# If no PRD_ID provided, executes ALL PRDs in processing

# Check if PRD_ID was provided as argument
if [ -n "$1" ]; then
    PRD_ID="$1"
    osascript -e "tell application \"Warp\"
        activate
        tell application \"System Events\"
            keystroke \"t\" using command down
            delay 0.5
            keystroke \"cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh $PRD_ID\"
            keystroke return
        end tell
    end tell"
else
    # No PRD_ID provided, execute all PRDs
    osascript -e 'tell application "Warp"
        activate
        tell application "System Events"
            keystroke "t" using command down
            delay 0.5
            keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh"
            keystroke return
        end tell
    end tell'
fi
