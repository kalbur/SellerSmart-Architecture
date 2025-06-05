#!/bin/bash
# Stream Deck launcher for SellerSmart Web dev server
# Opens Terminal and starts npm run dev

osascript -e 'tell application "Terminal"
    activate
    do script "cd /Users/kal/GitHub/SellerSmart-Architecture && ./scripts/web-dev-server.sh"
end tell'
