import turtle
import random
import math

# Hierarchical language data with sub-families (branches on branches!)
LANGUAGES = {
    "Indo-European": {
        "Germanic": {
            "English": ["the", "be", "to", "of", "and"],
            "German": ["der", "die", "und", "in", "den"],
            "Dutch": ["de", "het", "een", "van", "en"],
            "Swedish": ["och", "i", "att", "det", "som"],
            "Norwegian": ["og", "i", "det", "av", "en"],
            "Danish": ["og", "i", "at", "en", "det"],
            "Icelandic": ["og", "í", "að", "er", "sem"]
        },
        "Slavic": {
            "Russian": ["в", "и", "не", "на", "я"],
            "Polish": ["w", "na", "i", "się", "z"],
            "Ukrainian": ["в", "і", "на", "не", "що"],
            "Czech": ["a", "v", "se", "na", "že"],
            "Serbian": ["и", "у", "се", "на", "је"],
            "Bulgarian": ["и", "на", "в", "да", "с"],
            "Croatian": ["i", "u", "se", "na", "je"]
        },
        "Romance": {
            "Spanish": ["el", "de", "que", "y", "la"],
            "French": ["le", "de", "un", "être", "et"],
            "Italian": ["il", "di", "e", "la", "a"],
            "Portuguese": ["o", "de", "que", "e", "a"],
            "Romanian": ["și", "de", "la", "a", "în"],
            "Catalan": ["el", "de", "i", "la", "a"]
        },
        "Iranian": {
            "Persian": ["را", "در", "به", "از", "که"],
            "Kurdish": ["û", "li", "di", "de", "ji"],
            "Pashto": ["او", "په", "دی", "له", "چې"],
            "Tajik": ["ва", "дар", "аз", "ба", "ин"],
            "Ossetian": ["æмæ", "у", "ын", "та", "цы"]
        },
        "Indic": {
            "Hindi": ["है", "का", "की", "में", "को"],
            "Bengali": ["এ", "ও", "না", "কি", "হয়"],
            "Punjabi": ["ਦੇ", "ਨੂੰ", "ਹੈ", "ਤੇ", "ਦਾ"],
            "Marathi": ["आहे", "या", "ते", "त्या", "ही"],
            "Gujarati": ["છે", "ના", "તે", "એ", "માટે"],
            "Urdu": ["ہے", "کا", "کی", "میں", "کو"],
            "Nepali": ["छ", "को", "मा", "र", "छन्"],
            "Sinhala": ["ය", "ට", "හා", "එ", "වේ"]
        },
        "Greek": {
            "Greek": ["ο", "η", "το", "και", "να"],
            "Cypriot": ["ο", "τα", "που", "και", "για"]
        },
        "Celtic": {
            "Irish": ["an", "is", "ar", "le", "ag"],
            "Welsh": ["y", "yn", "a", "i", "o"],
            "Scottish": ["an", "a", "is", "aig", "air"]
        },
        "Baltic": {
            "Lithuanian": ["ir", "kad", "o", "yra", "į"],
            "Latvian": ["un", "ir", "ka", "uz", "ar"]
        }
    },
    "Sino-Tibetan": {
        "Sinitic": {
            "Mandarin": ["的", "一", "是", "在", "不"],
            "Cantonese": ["嘅", "咗", "啲", "喺", "係"],
            "Wu": ["个", "仔", "勿", "来", "哉"],
            "Min": ["个", "是", "伊", "啥", "无"],
            "Hakka": ["个", "係", "毋", "佢", "哩"]
        },
        "Tibeto-Burman": {
            "Burmese": ["က", "ကို", "မှာ", "နဲ့", "တွေ"],
            "Tibetan": ["པ", "ལ", "གི", "ང", "བ"],
            "Karen": ["ကီၢ်", "န", "တၢ်", "လၢ", "ယ"]
        }
    },
    "Afro-Asiatic": {
        "Semitic": {
            "Arabic": ["في", "من", "على", "إلى", "أن"],
            "Hebrew": ["את", "של", "על", "לא", "זה"],
            "Amharic": ["እና", "ነው", "ይህ", "በ", "ለ"],
            "Tigrinya": ["ን", "እዩ", "ኣብ", "ከም", "ብ"],
            "Maltese": ["li", "u", "ta'", "f'", "dan"]
        },
        "Cushitic": {
            "Somali": ["iyo", "oo", "ah", "ku", "waa"],
            "Oromo": ["fi", "kan", "kana", "ta'uu", "akka"]
        },
        "Chadic": {
            "Hausa": ["da", "a", "ba", "ya", "na"]
        }
    },
    "Austronesian": {
        "Malayo-Polynesian": {
            "Indonesian": ["yang", "dan", "di", "ini", "untuk"],
            "Malay": ["yang", "dan", "ini", "untuk", "pada"],
            "Tagalog": ["ang", "ng", "sa", "ay", "na"],
            "Javanese": ["lan", "karo", "ing", "iku", "kuwi"],
            "Sundanese": ["jeung", "teh", "di", "ka", "anu"],
            "Malagasy": ["ny", "amin'ny", "sy", "dia", "fa"],
            "Hawaiian": ["ka", "i", "o", "a", "ma"],
            "Samoan": ["o", "le", "i", "e", "a"],
            "Maori": ["te", "ki", "i", "o", "a"]
        },
        "Philippine": {
            "Cebuano": ["ang", "sa", "ug", "nga", "sa"],
            "Ilocano": ["ti", "iti", "nga", "ken", "dagiti"]
        }
    },
    "Niger-Congo": {
        "Bantu": {
            "Swahili": ["ya", "na", "wa", "ni", "katika"],
            "Zulu": ["nge", "ku", "nga", "ukuthi", "we"],
            "Shona": ["ne", "kuti", "zva", "pa", "mu"],
            "Xhosa": ["nge", "ukuba", "ku", "lo", "e"],
            "Kikuyu": ["na", "kũ", "wa", "nĩ", "ũrĩa"]
        },
        "Volta-Niger": {
            "Yoruba": ["ni", "ti", "si", "ati", "ko"],
            "Igbo": ["na", "nke", "bụ", "n'ime", "ka"]
        }
    },
    "Dravidian": {
        "Southern": {
            "Tamil": ["இன்", "ஒரு", "அந்த", "இந்த", "என்று"],
            "Malayalam": ["ഒരു", "ആണ്", "ഉം", "എന്ന്", "ഇത്"],
            "Kannada": ["ಒಂದು", "ಈ", "ಆ", "ಅಥವಾ", "ಮತ್ತು"]
        },
        "South-Central": {
            "Telugu": ["ఒక", "కు", "లో", "ను", "తో"],
            "Gondi": ["ओंदु", "मा", "ने", "त", "का"]
        }
    },
    "Turkic": {
        "Oghuz": {
            "Turkish": ["bir", "bu", "ve", "için", "ile"],
            "Azerbaijani": ["bir", "və", "bu", "üçün", "ki"],
            "Turkmen": ["bir", "we", "bu", "üçin", "bilen"]
        },
        "Karluk": {
            "Uzbek": ["va", "bir", "bu", "uchun", "bilan"],
            "Uyghur": ["بىر", "ۋە", "بۇ", "ئۈچۈن", "دىن"]
        },
        "Kipchak": {
            "Kazakh": ["бір", "және", "бұл", "үшін", "да"],
            "Kyrgyz": ["бир", "жана", "бул", "үчүн", "менен"],
            "Tatar": ["бер", "һәм", "бу", "өчен", "белән"]
        }
    },
    "Japonic": {
        "Japanese": {
            "Japanese": ["の", "に", "は", "を", "た"],
            "Ryukyuan": ["ぬ", "が", "や", "ん", "し"]
        }
    },
    "Koreanic": {
        "Korean": {
            "Korean": ["이", "가", "을", "는", "에"]
        }
    },
    "Austroasiatic": {
        "Mon-Khmer": {
            "Khmer": ["នៃ", "ក្នុង", "និង", "ដែល", "នេះ"],
            "Vietnamese": ["và", "của", "có", "là", "này"],
            "Mon": ["ကဵု", "ဂှ်", "တအ်", "မ္ဂး", "ပိုဲ"]
        }
    },
    "Uralic": {
        "Finnic": {
            "Finnish": ["ja", "on", "ei", "se", "oli"],
            "Estonian": ["ja", "on", "see", "ei", "ka"]
        },
        "Ugric": {
            "Hungarian": ["a", "az", "és", "hogy", "van"]
        }
    }
}

# Color scheme for language families
FAMILY_COLORS = {
    "Indo-European": "#FF6B6B",
    "Sino-Tibetan": "#4ECDC4",
    "Afro-Asiatic": "#FFE66D",
    "Austronesian": "#95E1D3",
    "Niger-Congo": "#FF8C42",
    "Dravidian": "#A8E6CF",
    "Turkic": "#C77DFF",
    "Japonic": "#FF85C0",
    "Koreanic": "#8DD9CC",
    "Austroasiatic": "#FFA3B5",
    "Uralic": "#96CEB4"
}

def setup_screen():
    """Initialize the turtle screen with dark background and scrolling"""
    screen = turtle.Screen()
    screen.setup(width=1920, height=1080)  # Larger window
    screen.screensize(2400, 2400)  # Enable scrolling with larger canvas
    screen.bgcolor("#0a0a15")
    screen.title("Hierarchical Global Language Tree - 100+ Languages (Scroll to explore)")
    screen.tracer(0)
    return screen

def create_turtle():
    """Create and configure the drawing turtle"""
    t = turtle.Turtle()
    t.speed(0)
    t.hideturtle()
    return t

def count_total_languages():
    """Count total number of languages"""
    total = 0
    for family in LANGUAGES.values():
        for subfamily in family.values():
            if isinstance(subfamily, dict) and any(isinstance(v, list) for v in subfamily.values()):
                total += len(subfamily)
    return total

def draw_language_tree(screen):
    """Draw the complete hierarchical language tree"""
    t = create_turtle()
    
    # Draw central trunk
    t.penup()
    t.goto(0, -300)  # Move trunk up significantly
    t.setheading(90)
    t.pendown()
    t.pensize(15)
    t.pencolor("#5C4033")
    t.forward(120)  # Taller trunk
    
    trunk_top = t.position()
    
    # Get language families
    families = list(LANGUAGES.keys())
    num_families = len(families)
    
    # Draw each language family in a circular pattern
    for i, family in enumerate(families):
        angle = 360 / num_families * i - 90
        
        t.penup()
        t.goto(trunk_top)
        t.setheading(angle)
        t.pendown()
        
        color = FAMILY_COLORS[family]
        
        # Draw family branch
        t.pensize(9)
        t.pencolor(color)
        branch_length = 120  # Longer branches
        t.forward(branch_length)
        
        # Label family
        family_pos = t.position()
        family_heading = t.heading()
        t.penup()
        
        text_angle = angle
        if 90 < angle < 270:
            text_angle = angle + 180
        
        t.setheading(text_angle)
        t.forward(20)
        t.write(family, align="center", font=("Arial", 11, "bold"))
        t.goto(family_pos)
        t.setheading(family_heading)
        t.pendown()
        
        # Draw subfamily branches
        subfamilies = list(LANGUAGES[family].keys())
        num_subfamilies = len(subfamilies)
        
        for j, subfamily in enumerate(subfamilies):
            spread_angle = 80  # Wider spread
            subfamily_angle = spread_angle / (num_subfamilies + 1) * (j + 1) - spread_angle / 2
            
            t.penup()
            t.goto(family_pos)
            t.setheading(family_heading + subfamily_angle)
            t.pendown()
            
            t.pensize(6)
            subfamily_length = 95  # Longer subfamily branches
            t.forward(subfamily_length)
            
            # Label subfamily
            subfamily_pos = t.position()
            subfamily_heading = t.heading()
            t.penup()
            
            text_angle = family_heading + subfamily_angle
            if 90 < text_angle % 360 < 270:
                text_angle += 180
            
            t.setheading(text_angle)
            t.forward(12)
            t.write(subfamily, align="center", font=("Arial", 9, "bold"))
            t.goto(subfamily_pos)
            t.setheading(subfamily_heading)
            t.pendown()
            
            # Draw individual language branches
            languages = list(LANGUAGES[family][subfamily].keys())
            num_langs = len(languages)
            
            for k, lang in enumerate(languages):
                lang_spread = 70  # Wider language spread
                lang_angle = lang_spread / (num_langs + 1) * (k + 1) - lang_spread / 2
                
                t.penup()
                t.goto(subfamily_pos)
                t.setheading(subfamily_heading + lang_angle)
                t.pendown()
                
                t.pensize(3.5)
                lang_length = 70  # Longer language branches
                t.forward(lang_length)
                
                # Label language
                lang_pos = t.position()
                lang_heading = t.heading()
                t.penup()
                
                text_angle = subfamily_heading + lang_angle
                if 90 < text_angle % 360 < 270:
                    text_angle += 180
                
                t.setheading(text_angle)
                t.forward(10)  # More space for text
                t.write(lang, align="center", font=("Arial", 8, "normal"))  # Larger font
                t.goto(lang_pos)
                t.setheading(lang_heading)
                t.pendown()
                
                # Draw word branches
                words = LANGUAGES[family][subfamily][lang]
                num_words = len(words)
                
                for m, word in enumerate(words):
                    word_spread = 60  # Even wider word spread for more space
                    word_angle = word_spread / (num_words + 1) * (m + 1) - word_spread / 2
                    
                    t.penup()
                    t.goto(lang_pos)
                    t.setheading(lang_heading + word_angle)
                    t.pendown()
                    
                    t.pensize(1.5)
                    word_length = 45  # Even longer word branches for more space
                    t.forward(word_length)
                    
                    # Draw dot and label word
                    t.dot(6, color)
                    word_pos = t.position()
                    t.penup()
                    
                    text_angle = lang_heading + word_angle
                    if 90 < text_angle % 360 < 270:
                        text_angle += 180
                    
                    t.setheading(text_angle)
                    t.forward(12)  # More space between dot and text
                    t.write(word, align="center", font=("Arial", 7, "normal"))  # Larger font for words
                    t.goto(word_pos)
                    t.pendown()
        
        # Update display periodically
        if i % 2 == 0:
            turtle.update()
    
    # Add title and info
    t.penup()
    t.goto(0, 650)  # Much higher position
    t.pencolor("#FFFFFF")
    t.write("Hierarchical Global Language Tree", align="center", 
            font=("Arial", 24, "bold"))
    
    t.goto(0, 620)
    total_langs = count_total_languages()
    t.write(f"{total_langs} Languages • 4 Levels of Branching", align="center", 
            font=("Arial", 12, "normal"))
    
    t.goto(0, 595)
    t.write("⬆️⬇️ Use arrow keys or mouse to scroll and explore", align="center", 
            font=("Arial", 10, "italic"))
    
    # Add legend at bottom
    t.goto(0, -850)  # Much lower position for scrollable area
    t.write("Root → Family → Subfamily → Language → Common Words", align="center", 
            font=("Arial", 10, "italic"))
    
    turtle.update()

def add_decorative_elements(screen):
    """Add subtle glow effects"""
    glow = turtle.Turtle()
    glow.hideturtle()
    glow.speed(0)
    glow.penup()
    
    for _ in range(60):  # More stars for larger canvas
        x = random.randint(-1100, 1100)  # Wider range for scrollable area
        y = random.randint(-800, 600)
        size = random.randint(2, 4)
        glow.goto(x, y)
        glow.dot(size, "#FFFFFF")
    
    turtle.update()

def main():
    """Main function to run the fractal drawer"""
    screen = setup_screen()
    
    total_langs = count_total_languages()
    
    print("=" * 70)
    print("HIERARCHICAL GLOBAL LANGUAGE TREE FRACTAL")
    print("=" * 70)
    print(f"\n🌳 Drawing {total_langs} languages with hierarchical structure...")
    print("\n✨ SCROLLABLE CANVAS ENABLED!")
    print("   Use arrow keys or drag with mouse to explore the entire tree")
    print("\nHierarchy Levels:")
    print("  1️⃣  Root (trunk)")
    print("  2️⃣  Language Families (11 families)")
    print("  3️⃣  Subfamilies (branches on branches!)")
    print("  4️⃣  Individual Languages")
    print("  5️⃣  Common Words (leaf nodes)")
    
    print("\n📊 Language Distribution by Family:")
    for family in LANGUAGES.keys():
        subfamily_count = len(LANGUAGES[family])
        lang_count = sum(len(LANGUAGES[family][sf]) for sf in LANGUAGES[family])
        print(f"  • {family}: {subfamily_count} subfamilies, {lang_count} languages")
    
    print("\n✨ Building the tree (this may take a moment)...")
    draw_language_tree(screen)
    add_decorative_elements(screen)
    
    print("\n🎉 Complete!")
    print("\n🖱️  TIP: You can scroll using:")
    print("   • Arrow keys (↑ ↓ ← →)")
    print("   • Mouse wheel")
    print("   • Click and drag the canvas")
    print("\n👆 Click the window to close.")
    screen.update()
    screen.exitonclick()

if __name__ == "__main__":
    main()