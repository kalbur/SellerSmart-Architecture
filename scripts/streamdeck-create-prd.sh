#!/bin/bash
# Stream Deck launcher for PRD creation
# Opens Terminal and runs the PRD creation script

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/create-prd.sh"
end tell'
