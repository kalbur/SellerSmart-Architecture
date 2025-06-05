#!/bin/bash
# Stream Deck launcher for killing port 3000
# Opens Warp, runs the script, then closes

osascript -e 'tell application "Warp"
    activate
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/kill-port-3000.sh; sleep 2; exit"
        keystroke return
    end tell
end tell'
