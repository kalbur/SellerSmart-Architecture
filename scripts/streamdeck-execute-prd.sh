#!/bin/bash
# Stream Deck launcher for PRD execution
# Opens Warp and runs the PRD execution script
# If no PRD_ID provided, executes ALL PRDs in processing

# Check if PRD_ID was provided as argument
if [ -n "$1" ]; then
    PRD_ID="$1"
    osascript << EOF
tell application "Warp" to activate
delay 1
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 1
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh $PRD_ID"
        key code 36
    end tell
end tell
EOF
else
    # No PRD_ID provided, execute all PRDs
    osascript << 'EOF'
tell application "Warp" to activate
delay 1
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 1
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd.sh"
        key code 36
    end tell
end tell
EOF
fi
