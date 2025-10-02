# 🌳 Hierarchical Global Language Tree Fractal

A beautiful fractal visualization of the world's language families, subfamilies, and individual languages using Python's turtle graphics.

![Language Tree Concept](https://img.shields.io/badge/Languages-100+-blue) ![Families](https://img.shields.io/badge/Families-11-green) ![Python](https://img.shields.io/badge/Python-3.7+-yellow)

## 🎨 Features

- **100+ Languages** from 11 major language families
- **4-Level Hierarchical Structure**: Root → Family → Subfamily → Language → Words
- **Circular Fractal Layout** for optimal space utilization
- **Color-coded branches** for each language family
- **Most common words** displayed at the leaf nodes
- **Dark theme** with decorative star elements

## 📊 Language Coverage

### Indo-European Family (50+ languages)
- **Germanic**: English, German, Dutch, Swedish, Norwegian, Danish, Icelandic
- **Slavic**: Russian, Polish, Ukrainian, Czech, Serbian, Bulgarian, Croatian
- **Romance**: Spanish, French, Italian, Portuguese, Romanian, Catalan
- **Iranian**: Persian, Kurdish, Pashto, Tajik, Ossetian
- **Indic**: Hindi, Bengali, Punjabi, Marathi, Gujarati, Urdu, Nepali, Sinhala
- **Greek, Celtic, Baltic** subfamilies

### Other Major Families
- **Sino-Tibetan**: Mandarin, Cantonese, Wu, Min, Hakka, Burmese, Tibetan, Karen
- **Afro-Asiatic**: Arabic, Hebrew, Amharic, Tigrinya, Maltese, Somali, Oromo, Hausa
- **Austronesian**: Indonesian, Malay, Tagalog, Javanese, Cebuano, Hawaiian, Samoan, Maori
- **Niger-Congo**: Swahili, Zulu, Shona, Xhosa, Kikuyu, Yoruba, Igbo
- **Dravidian**: Tamil, Malayalam, Kannada, Telugu, Gondi
- **Turkic**: Turkish, Azerbaijani, Uzbek, Kazakh, Kyrgyz, Tatar, Turkmen, Uyghur
- **Japonic**: Japanese, Ryukyuan
- **Koreanic**: Korean
- **Austroasiatic**: Khmer, Vietnamese, Mon
- **Uralic**: Finnish, Estonian, Hungarian

## 🚀 Installation

### Prerequisites

- Python 3.7 or higher
- No external packages required! Uses only Python standard library

### Dependencies

This project uses **only built-in Python libraries**:

```python
import turtle    # For graphics and drawing
import random    # For decorative elements
import math      # For calculations (imported but available)
```

The `turtle` module comes pre-installed with Python, so **no pip install needed**!

### Setup

1. **Clone or download** the script:
```bash
# If using git
git clone <repository-url>
cd language-tree-fractal

# Or simply download the .py file
```

2. **Verify Python installation**:
```bash
python --version
# or
python3 --version
```

Should show Python 3.7 or higher.

3. **Run the script**:
```bash
python language_tree.py
# or
python3 language_tree.py
```

## 💻 Usage

### Basic Usage

Simply run the script:

```bash
python language_tree.py
```

The program will:
1. Print statistics about the language tree
2. Draw the fractal visualization
3. Display the interactive window
4. Wait for you to click to close

### What You'll See

```
==================================================================
HIERARCHICAL GLOBAL LANGUAGE TREE FRACTAL
==================================================================

🌳 Drawing 100+ languages with hierarchical structure...

Hierarchy Levels:
  1️⃣  Root (trunk)
  2️⃣  Language Families (11 families)
  3️⃣  Subfamilies (branches on branches!)
  4️⃣  Individual Languages
  5️⃣  Common Words (leaf nodes)

📊 Language Distribution by Family:
  • Indo-European: 8 subfamilies, 50+ languages
  • Sino-Tibetan: 2 subfamilies, 8 languages
  ...

✨ Building the tree (this may take a moment)...

🎉 Complete!

👆 Click the window to close.
```

## 🎨 Customization

### Adjust Window Size

Edit in `setup_screen()`:
```python
screen.setup(width=1600, height=1000)  # Change dimensions
```

### Change Background Color

```python
screen.bgcolor("#0a0a15")  # Change hex color
```

### Modify Branch Lengths

Adjust these values in `draw_language_tree()`:
```python
branch_length = 90        # Family branch length
subfamily_length = 75     # Subfamily branch length
lang_length = 55          # Language branch length
word_length = 28          # Word branch length
```

### Add More Languages

Add to the `LANGUAGES` dictionary:
```python
"Indo-European": {
    "Germanic": {
        "YourLanguage": ["word1", "word2", "word3", "word4", "word5"]
    }
}
```

### Change Colors

Modify `FAMILY_COLORS` dictionary:
```python
FAMILY_COLORS = {
    "Indo-European": "#FF6B6B",  # Your hex color
    ...
}
```

## 🐛 Troubleshooting

### "No module named 'turtle'"

**On Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install python3-tk

# Fedora
sudo dnf install python3-tkinter

# Arch
sudo pacman -S tk
```

**On macOS:**
Turtle should come with Python. If not:
```bash
brew install python-tk
```

**On Windows:**
Turtle comes with Python. Reinstall Python from python.org if missing.

### Window Closes Immediately

The script uses `screen.exitonclick()` - click the window to close it intentionally.

### Drawing Too Slow

Change in `setup_screen()`:
```python
screen.tracer(0)  # Already set for fast drawing
```

Remove update calls if you want instant rendering:
```python
# Comment out these lines in draw_language_tree():
if i % 2 == 0:
    turtle.update()
```

### Text Overlapping

Reduce the number of languages per subfamily or increase window size.

## 📝 Technical Details

### Algorithm

1. **Radial Layout**: Language families distributed in 360° circle
2. **Recursive Branching**: Each level branches at calculated angles
3. **Text Orientation**: Automatically rotates for readability
4. **Color Coding**: Each family has unique color scheme

### Performance

- **Drawing Time**: 10-30 seconds depending on system
- **Languages**: 100+ languages
- **Branches**: 500+ total branches
- **Memory**: Minimal (< 50MB)

## 🤝 Contributing

Want to add more languages? Follow this structure:

```python
"FamilyName": {
    "SubfamilyName": {
        "LanguageName": ["word1", "word2", "word3", "word4", "word5"]
    }
}
```

Choose the 5 most common words in each language!

## 📄 License

This project is open source and available for educational purposes.

## 🌟 Credits

- Language data sourced from linguistic research
- Created with Python's turtle graphics library
- Inspired by natural fractal patterns in tree growth

## 📧 Support

If you encounter issues:
1. Check Python version (3.7+)
2. Verify turtle/tkinter installation
3. Check console output for error messages

---

**Enjoy exploring the beautiful diversity of human languages! 🌍🗣️**
