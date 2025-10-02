#!/bin/bash

# Daily Affirmation Tool
# Fetches an inspirational quote from the ZenQuotes API

# Colors for pretty output
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RESET='\033[0m'

# Function to display the affirmation
show_affirmation() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${YELLOW}          ✨ YOUR DAILY AFFIRMATION ✨               ${CYAN}║${RESET}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    
    # Fetch quote from ZenQuotes API
    response=$(curl -s "https://www.affirmations.dev/")
    
    # Check if curl was successful
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}Unable to fetch affirmation. Here's one for you:${RESET}"
        echo -e "${GREEN}\"Believe in yourself and all that you are.\"${RESET}"
        echo -e "   - Unknown"
        return
    fi
    
    # Parse JSON response (basic parsing without jq)
    quote=$(echo "$response" | sed 's/.*"q":"\([^"]*\)".*/\1/')
    author=$(echo "$response" | sed 's/.*"a":"\([^"]*\)".*/\1/')
    
    # Display the quote
    echo -e "${GREEN}\"$quote\"${RESET}"
    echo ""
    echo -e "   ${CYAN}— $author${RESET}"
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════${RESET}"
}

# Main execution
clear
show_affirmation

log_file="$HOME/.affirmations.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Affirmation viewed" >> "$log_file"

echo ""
echo -e "${YELLOW}💡 Tip: Add this script to your .bashrc or .zshrc to see an affirmation every time you open your terminal!${RESET}"
echo ""
