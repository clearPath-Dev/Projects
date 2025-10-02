flowchart TD
    Start([Start Script]) --> Input1[Prompt: Enter project directory]
    Input1 --> ReadDir[Read DIR variable]
    ReadDir --> Input2[Prompt: Enter project name]
    Input2 --> ReadName[Read NAME variable]
    
    ReadName --> CreateReadme[Create README.md file<br/>with project name and<br/>basic template]
    
    CreateReadme --> CreateGitignore[Create .gitignore file<br/>with common Python<br/>exclusions]
    
    CreateGitignore --> CheckFile{Does .gitignore<br/>file exist?}
    
    CheckFile -->|Yes| Success1[Echo: .gitignore created<br/>successfully ✅]
    CheckFile -->|No| Error1[Echo: ❌ .gitignore<br/>not created]
    
    Success1 --> Final[Echo: ✅ README.md and<br/>.gitignore created in DIR]
    Error1 --> Final
    
    Final --> End([End Script])
    
