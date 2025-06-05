#!/bin/bash
# Stream Deck launcher for PRD creation
# Opens Warp and runs the PRD creation script

osascript << 'EOF'
tell application "Warp" to activate
delay 0.5
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/create-prd.sh"
        keystroke return
    end tell
end tell
EOF
