#!/bin/bash
# Stream Deck launcher for killing port 3000
# Opens Terminal and runs the kill port script

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/kill-port-3000.sh"
end tell'
