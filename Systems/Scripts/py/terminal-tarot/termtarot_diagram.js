flowchart TD
    Start([🔮 Terminal Tarot Reader]) --> Menu{Choose Reading Type}
    
    Menu -->|1| Single[Single Card Reading]
    Menu -->|2| Three[Three Card Reading<br/>Past - Present - Future]
    Menu -->|3| Five[Five Card Reading<br/>Situation Spread]
    Menu -->|4| Exit([✨ Exit])
    
    Single --> Draw1[Draw 1 Random Card]
    Three --> Draw3[Draw 3 Random Cards]
    Five --> Draw5[Draw 5 Random Cards]
    
    Draw1 --> Reverse1{Randomly<br/>Reversed?}
    Draw3 --> Reverse3{Randomly<br/>Reversed?}
    Draw5 --> Reverse5{Randomly<br/>Reversed?}
    
    Reverse1 -->|Yes| ShowRev1[Show Card Reversed ⌄]
    Reverse1 -->|No| ShowUp1[Show Card Upright ⌃]
    
    Reverse3 -->|Yes/No| ShowCards3[Display 3 Cards<br/>with Positions]
    Reverse5 -->|Yes/No| ShowCards5[Display 5 Cards<br/>with Meanings]
    
    ShowRev1 --> Meaning1[Display Reversed Meaning]
    ShowUp1 --> Meaning2[Display Upright Meaning]
    
    ShowCards3 --> Meanings3[Display All 3 Meanings]
    ShowCards5 --> Meanings5[Display All 5 Meanings]
    
    Meaning1 --> Continue{Continue?}
    Meaning2 --> Continue
    Meanings3 --> Continue
    Meanings5 --> Continue
    
    Continue -->|Press Enter| Menu
    Continue -->|Ctrl+C| Exit