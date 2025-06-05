#!/bin/bash
# Stream Deck launcher for multi-repo status check
# Opens Terminal and runs the multi-repo status script

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/multi-repo-status.sh"
end tell'
