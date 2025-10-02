# 🔮 Terminal Tarot Card Reader

A minimalist terminal-based tarot card reader with ASCII art cards and authentic Major Arcana interpretations.

## ✨ Features

- **Zero Dependencies**: Pure Python 3 - no external packages required
- **22 Major Arcana Cards**: Complete set with upright and reversed meanings
- **ASCII Art**: Beautiful card displays right in your terminal
- **Multiple Spread Types**:
  - Single Card Reading
  - Three Card Spread (Past, Present, Future)
  - Five Card Spread (Situation)
- **Random Reversals**: Cards can appear upright (⌃) or reversed (⌄)
- **Interactive Menu**: Easy navigation with quick-quit option

## 🚀 Installation

No installation needed! Just download and run.

```bash
# Download the file
curl -O https://your-url/tarot.py

# Make it executable
chmod +x tarot.py

# Run it
./tarot.py
```

Or simply:
```bash
python3 tarot.py
```

## 🎴 Usage

1. **Launch the app**:
   ```bash
   python3 tarot.py
   ```

2. **Choose your reading type** (1-4):
   - `1` - Single card for quick guidance
   - `2` - Three cards for past/present/future insight
   - `3` - Five cards for deeper situation analysis
   - `4` - Exit the application

3. **Type `q` at any time** to quit instantly

## 📖 Example Output

```
🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮
      TERMINAL TAROT READER      
🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮

╔══════════════════════════════════════╗
║                                      ║
║          The Magician                ║
║                                      ║
║                  ⌃                   ║
║                                      ║
╚══════════════════════════════════════╝

Meaning: Manifestation, resourcefulness, power, inspired action
```

## 🎯 Card Meanings

All 22 Major Arcana cards included:

- The Fool, The Magician, The High Priestess, The Empress
- The Emperor, The Hierophant, The Lovers, The Chariot
- Strength, The Hermit, Wheel of Fortune, Justice
- The Hanged Man, Death, Temperance, The Devil
- The Tower, The Star, The Moon, The Sun
- Judgement, The World

Each card has both upright and reversed interpretations.

## 🔮 Reading Spreads

### Single Card
Perfect for daily guidance or yes/no questions.

### Three Card Spread
- **Card 1**: Past - What has led to this moment
- **Card 2**: Present - Your current situation
- **Card 3**: Future - What's coming or potential outcome

### Five Card Spread
A comprehensive situation reading:
- **Card 1**: The heart of the matter
- **Card 2**: Obstacles or challenges
- **Card 3**: Hidden influences
- **Card 4**: Advice or action to take
- **Card 5**: Potential outcome

## ⚙️ Requirements

- Python 3.6 or higher
- Terminal with UTF-8 support (for card symbols)
- That's it!

## 🎨 Customization

The code is simple and easy to modify:

- Add Minor Arcana cards by expanding the `MAJOR_ARCANA` dictionary
- Customize card ASCII art in the `draw_card_art()` function
- Add new spread types in the main menu
- Modify interpretations to match your preferred deck

## 📝 Technical Details

- Uses only Python standard library (`random`, `sys`)
- Card selection is random without replacement (no duplicates in a spread)
- 50/50 chance for each card to appear reversed
- Clean exit handling with Ctrl+C or 'q' command

## 🤝 Contributing

Feel free to fork and enhance! Some ideas:
- Add Minor Arcana (56 additional cards)
- More spread types (Celtic Cross, Horseshoe, etc.)
- Card of the day feature
- Save reading history
- Color support for different card types

## 📜 License

Free to use, modify, and share. May the cards guide you well! ✨

## 🙏 Acknowledgments

Card meanings based on traditional Rider-Waite-Smith tarot interpretations.

---

**Note**: This is for entertainment and reflection purposes. Tarot readings should complement, not replace, professional advice for important life decisions.
