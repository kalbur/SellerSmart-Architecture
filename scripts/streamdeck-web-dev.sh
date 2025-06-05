#!/bin/bash
# Stream Deck launcher for SellerSmart Web dev server
# Opens Warp and starts npm run dev

osascript -e 'tell application "Warp"
    activate
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/web-dev-server.sh"
        keystroke return
    end tell
end tell'
