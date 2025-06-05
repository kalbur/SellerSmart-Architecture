#!/bin/bash
# Stream Deck launcher to list all PRDs
# Shows processing and completed PRDs in Warp

osascript << 'EOF'
tell application "Warp" to activate
delay 1
tell application "System Events"
    tell process "Warp"
        keystroke "n" using {command down}
        delay 1
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && echo \"=== PROCESSING PRDs ===\" && ls -1 .prds/processing/*.md 2>/dev/null | sed \"s|.prds/processing/||\" | sed \"s|.md||\" || echo \"No PRDs in processing\" && echo \"\" && echo \"=== COMPLETED PRDs ===\" && ls -1 .prds/completed/*.md 2>/dev/null | sed \"s|.prds/completed/||\" | sed \"s|.md||\" || echo \"No completed PRDs\""
        key code 36
    end tell
end tell
EOF
