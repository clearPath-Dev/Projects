#!/usr/bin/env python3
"""
Terminal Tarot Card Reader
A simple tarot reading app with ASCII art cards
"""

import random
import sys

# Major Arcana cards with meanings
MAJOR_ARCANA = {
    "The Fool": {
        "upright": "New beginnings, innocence, spontaneity, free spirit",
        "reversed": "Recklessness, taken advantage of, inconsideration"
    },
    "The Magician": {
        "upright": "Manifestation, resourcefulness, power, inspired action",
        "reversed": "Manipulation, poor planning, untapped talents"
    },
    "The High Priestess": {
        "upright": "Intuition, sacred knowledge, divine feminine, subconscious",
        "reversed": "Secrets, disconnected from intuition, withdrawal"
    },
    "The Empress": {
        "upright": "Femininity, beauty, nature, nurturing, abundance",
        "reversed": "Creative block, dependence on others, emptiness"
    },
    "The Emperor": {
        "upright": "Authority, structure, control, fatherhood, discipline",
        "reversed": "Domination, excessive control, lack of discipline"
    },
    "The Hierophant": {
        "upright": "Spiritual wisdom, tradition, conformity, institutions",
        "reversed": "Rebellion, subversiveness, new approaches"
    },
    "The Lovers": {
        "upright": "Love, harmony, relationships, values alignment, choices",
        "reversed": "Self-love, disharmony, imbalance, misalignment"
    },
    "The Chariot": {
        "upright": "Control, willpower, success, determination, direction",
        "reversed": "Self-discipline, opposition, lack of direction"
    },
    "Strength": {
        "upright": "Courage, persuasion, influence, compassion, inner strength",
        "reversed": "Self-doubt, weakness, insecurity, low energy"
    },
    "The Hermit": {
        "upright": "Soul-searching, introspection, inner guidance, solitude",
        "reversed": "Isolation, loneliness, withdrawal from others"
    },
    "Wheel of Fortune": {
        "upright": "Good luck, karma, life cycles, destiny, turning point",
        "reversed": "Bad luck, resistance to change, breaking cycles"
    },
    "Justice": {
        "upright": "Justice, fairness, truth, cause and effect, law",
        "reversed": "Unfairness, lack of accountability, dishonesty"
    },
    "The Hanged Man": {
        "upright": "Pause, surrender, letting go, new perspectives",
        "reversed": "Delays, resistance, stalling, indecision"
    },
    "Death": {
        "upright": "Endings, change, transformation, transition",
        "reversed": "Resistance to change, personal transformation, inner purging"
    },
    "Temperance": {
        "upright": "Balance, moderation, patience, purpose, meaning",
        "reversed": "Imbalance, excess, self-healing, re-alignment"
    },
    "The Devil": {
        "upright": "Shadow self, attachment, addiction, restriction, sexuality",
        "reversed": "Releasing limiting beliefs, exploring dark thoughts, detachment"
    },
    "The Tower": {
        "upright": "Sudden change, upheaval, chaos, revelation, awakening",
        "reversed": "Personal transformation, fear of change, averting disaster"
    },
    "The Star": {
        "upright": "Hope, faith, purpose, renewal, spirituality",
        "reversed": "Lack of faith, despair, self-trust, disconnection"
    },
    "The Moon": {
        "upright": "Illusion, fear, anxiety, subconscious, intuition",
        "reversed": "Release of fear, repressed emotion, inner confusion"
    },
    "The Sun": {
        "upright": "Positivity, fun, warmth, success, vitality",
        "reversed": "Inner child, feeling down, overly optimistic"
    },
    "Judgement": {
        "upright": "Judgement, rebirth, inner calling, absolution",
        "reversed": "Self-doubt, inner critic, ignoring the call"
    },
    "The World": {
        "upright": "Completion, accomplishment, travel, fulfillment",
        "reversed": "Seeking closure, short-cuts, delays"
    }
}

def draw_card_art(card_name, reversed=False):
    """Draw ASCII art for a tarot card"""
    card_width = 40
    
    # Card border
    top = "╔" + "═" * (card_width - 2) + "╗"
    bottom = "╚" + "═" * (card_width - 2) + "╝"
    side = "║"
    
    # Card title
    if reversed:
        title = f"{card_name} (Reversed)"
    else:
        title = card_name
    
    padding = (card_width - 2 - len(title)) // 2
    title_line = side + " " * padding + title + " " * (card_width - 2 - padding - len(title)) + side
    
    # Simple card interior
    empty_line = side + " " * (card_width - 2) + side
    
    # Draw card
    print(top)
    print(empty_line)
    print(title_line)
    print(empty_line)
    
    # Add a simple symbol in the middle
    if reversed:
        symbol = "⌄"
    else:
        symbol = "⌃"
    
    symbol_line = side + " " * ((card_width - 2 - len(symbol)) // 2) + symbol + " " * ((card_width - 2 - len(symbol)) // 2) + side
    print(symbol_line)
    print(empty_line)
    print(bottom)

def get_reading(card_name, reversed):
    """Get the meaning of a card"""
    card_data = MAJOR_ARCANA[card_name]
    
    if reversed:
        return card_data["reversed"]
    else:
        return card_data["upright"]

def perform_reading(num_cards=1):
    """Perform a tarot reading"""
    cards = list(MAJOR_ARCANA.keys())
    drawn_cards = random.sample(cards, min(num_cards, len(cards)))
    
    print("\n" + "=" * 50)
    print("✨ YOUR TAROT READING ✨".center(50))
    print("=" * 50 + "\n")
    
    for i, card in enumerate(drawn_cards, 1):
        reversed = random.choice([True, False])
        
        if num_cards > 1:
            print(f"\n--- Card {i} ---\n")
        
        draw_card_art(card, reversed)
        
        meaning = get_reading(card, reversed)
        print(f"\nMeaning: {meaning}\n")
        
        if i < num_cards:
            print("-" * 50)

def get_input(prompt):
    """Get user input and check for quit command"""
    response = input(prompt).strip().lower()
    if response == 'q':
        print("\n✨ Thank you for consulting the cards. ✨\n")
        sys.exit(0)
    return response

def main():
    """Main function"""
    print("\n" + "🔮" * 20)
    print("TERMINAL TAROT READER".center(40))
    print("🔮" * 20 + "\n")
    print("(Type 'q' at any time to quit)\n")
    
    while True:
        print("\nWhat type of reading would you like?")
        print("1. Single Card Reading")
        print("2. Three Card Reading (Past, Present, Future)")
        print("3. Five Card Reading (Situation)")
        print("4. Exit")
        
        choice = get_input("\nEnter your choice (1-4 or q): ")
        
        if choice == "1":
            perform_reading(1)
        elif choice == "2":
            print("\n📜 Past - Present - Future Spread\n")
            perform_reading(3)
        elif choice == "3":
            print("\n📜 Five Card Situation Spread\n")
            perform_reading(5)
        elif choice == "4" or choice == "q":
            print("\n✨ Thank you for consulting the cards. ✨\n")
            sys.exit(0)
        else:
            print("\n❌ Invalid choice. Please try again.")
        
        get_input("\n[Press Enter to continue or q to quit...]")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✨ Thank you for consulting the cards. ✨\n")
        sys.exit(0)