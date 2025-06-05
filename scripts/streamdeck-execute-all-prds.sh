#!/bin/bash
# Stream Deck launcher for multi-PRD execution
# Opens Terminal and executes ALL PRDs in processing

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/execute-prd-multi.sh"
end tell'
