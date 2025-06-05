#!/bin/bash
# Stream Deck launcher for killing port 3000
# Opens Warp, runs the script, then closes

# Open Warp and execute command
osascript << 'EOF'
tell application "Warp" to activate
delay 0.5
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/kill-port-3000.sh; sleep 2; exit"
        keystroke return
    end tell
end tell
EOF
