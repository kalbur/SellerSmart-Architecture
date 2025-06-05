#!/bin/bash
# Stream Deck launcher for SellerSmart Web dev server
# Opens Warp and starts npm run dev

osascript << 'EOF'
tell application "Warp" to activate
delay 0.5
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/web-dev-server.sh"
        keystroke return
    end tell
end tell
EOF
