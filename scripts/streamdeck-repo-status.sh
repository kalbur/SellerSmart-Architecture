#!/bin/bash
# Stream Deck launcher for multi-repo status check
# Opens Warp and runs the multi-repo status script

osascript -e 'tell application "Warp"
    activate
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/multi-repo-status.sh"
        keystroke return
    end tell
end tell'
