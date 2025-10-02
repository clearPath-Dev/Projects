# Daily Affirmation Tool ✨

A simple bash script that fetches and displays inspirational quotes and affirmations to brighten your day.

## Features

- 🎨 Beautiful, colorful terminal output
- 🌐 Fetches daily quotes from the ZenQuotes API
- 📝 Automatically logs your affirmation views
- 🔄 Built-in fallback quote if API is unavailable
- ⚡ Lightweight with minimal dependencies
- 🛡️ Works without requiring `jq` or other JSON parsers

## Requirements

- Bash shell
- `curl` (usually pre-installed on most systems)
- Internet connection (for API access)

## Installation

1. **Download the script:**
   ```bash
   curl -o affirmation.sh https://your-script-url.com/affirmation.sh
   ```
   
   Or simply copy the script content into a new file.

2. **Make it executable:**
   ```bash
   chmod +x affirmation.sh
   ```

3. **Optional: Move to your PATH:**
   ```bash
   sudo mv affirmation.sh /usr/local/bin/affirmation
   ```
   
   This allows you to run it from anywhere using just `affirmation`.

## Usage

### Basic Usage

Run the script directly:
```bash
./affirmation.sh
```

Or if you moved it to your PATH:
```bash
affirmation
```

### Auto-run on Terminal Startup

To see an affirmation every time you open a new terminal:

**For Bash users:**
```bash
echo '~/path/to/affirmation.sh' >> ~/.bashrc
```

**For Zsh users:**
```bash
echo '~/path/to/affirmation.sh' >> ~/.zshrc
```

**For Fish users:**
```bash
echo '~/path/to/affirmation.sh' >> ~/.config/fish/config.fish
```

### Scheduled Daily Affirmations

Set up a cron job to display affirmations at specific times:

```bash
crontab -e
```

Add one of these lines:
```bash
# Every day at 9 AM
0 9 * * * DISPLAY=:0 /path/to/affirmation.sh

# Every weekday at 8 AM
0 8 * * 1-5 /path/to/affirmation.sh
```

## Configuration

### Change the API

The script uses Afirmations.dev by default. You can modify it to use other APIs:

**Affirmations.dev (affirmations only):**
```bash
response=$(curl -s "https://www.affirmations.dev/")
```

**Quotable (more quotes):**
```bash
response=$(curl -s "https://api.quotable.io/random")
```

### Customize Colors

Edit the color variables at the top of the script:
```bash
CYAN='\033[0;36m'    # Change to your preferred color code
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
```

Common color codes:
- Red: `\033[0;31m`
- Blue: `\033[0;34m`
- Purple: `\033[0;35m`
- White: `\033[1;37m`

### View Your Affirmation Log

The script keeps a log of when you view affirmations:
```bash
cat ~/.affirmations.log
```

## Troubleshooting

### "Unable to fetch affirmation" message

This usually means:
- No internet connection
- API is temporarily down
- `curl` is not installed

**Fix:** Install curl if missing:
```bash
# Ubuntu/Debian
sudo apt-get install curl

# macOS
brew install curl

# Fedora
sudo dnf install curl
```

### Colors not displaying correctly

Some terminals don't support colors. Try:
```bash
export TERM=xterm-256color
```

### Script not running on startup

Make sure:
1. The path in your `.bashrc`/`.zshrc` is correct
2. The script has execute permissions
3. You've sourced the config file or opened a new terminal

## API Information

**ZenQuotes API:**
- Free to use
- No API key required
- Rate limit: 5 requests per 30 seconds
- Documentation: https://zenquotes.io/

## Examples

**Terminal Output:**
```
╔════════════════════════════════════════════════════════╗
║          ✨ YOUR DAILY AFFIRMATION ✨               ║
╚════════════════════════════════════════════════════════╝

"The only way to do great work is to love what you do."

   — Steve Jobs

════════════════════════════════════════════════════════

💡 Tip: Add this script to your .bashrc or .zshrc to see an affirmation every time you open your terminal!
```

## Contributing

Feel free to fork and modify this script! Some ideas for enhancements:
- Add category filtering (motivational, funny, wisdom, etc.)
- Create a "favorites" system
- Add notification support
- Display multiple affirmations
- Create a GUI version

## License

This script is provided as-is for personal use. Modify and distribute freely.

## Credits

- Quotes provided by [Affirmations.dev](https://affirmations.dev/)
- Created with ❤️ for daily inspiration

---

**Start each day with positivity! 🌟**
