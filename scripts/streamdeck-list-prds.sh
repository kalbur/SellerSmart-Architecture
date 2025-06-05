#!/bin/bash
# Stream Deck launcher to list all PRDs
# Shows processing and completed PRDs in Warp

osascript -e 'tell application "Warp"
    activate
    tell application "System Events"
        keystroke "t" using command down
        delay 0.5
        keystroke "cd /Users/kal/GitHub/SellerSmart-Architecture && echo \"=== PROCESSING PRDs ===\" && ls -1 .prds/processing/*.md 2>/dev/null | sed \"s|.prds/processing/||\" | sed \"s|.md||\" || echo \"No PRDs in processing\" && echo \"\" && echo \"=== COMPLETED PRDs ===\" && ls -1 .prds/completed/*.md 2>/dev/null | sed \"s|.prds/completed/||\" | sed \"s|.md||\" || echo \"No completed PRDs\""
        keystroke return
    end tell
end tell'
