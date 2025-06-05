#!/bin/bash
# Stream Deck launcher for killing port 3000
# Opens Terminal, runs the script, then closes

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/kill-port-3000.sh; sleep 2; exit"
end tell'
