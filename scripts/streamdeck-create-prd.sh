#!/bin/bash
# Stream Deck launcher for PRD creation
# Opens Warp and runs the PRD creation script

osascript -e 'tell application "Warp"
    activate
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/create-prd.sh"
        keystroke return
    end tell
end tell'
