#!/bin/bash
# Stream Deck launcher for killing port 3000
# Opens Warp, runs the script, then closes

# Open Warp and execute command
osascript << 'EOF'
tell application "Warp" to activate
delay 1
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 1
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/kill-port-3000.sh; sleep 2; exit"
        delay 1
        key code 36
    end tell
end tell
EOF
