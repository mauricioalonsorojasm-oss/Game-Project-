🍸 Pisco Rush

Pisco Rush is a browser-based arcade game built using HTML, CSS, and beginner level JavaScript.
The goal of the game is to catch the correct ingredients in the correct order to prepare a Pisco drink, while avoiding incorrect bottles.

This project was developed as part of the Ironhack Web Development Bootcamp, with a focus on DOM manipulation, game logic, and UI state management.

🎮 Game Overview

Items fall from the top of the screen in different lanes.

The player controls a glass that can move left and right.

Ingredients must be caught in the following order:

ICE → PISCO → COLA

Catching an ingredient in the wrong order or catching a forbidden bottle results in losing a life.

The game ends when all lives are lost.

🕹️ Controls

Left Arrow (←): Move the glass left

Right Arrow (→): Move the glass right

Mouse / Click: Start or restart the game

🧠 Game Rules

Only recipe ingredients increase the score.

Forbidden bottles can appear and should be avoided.

The recipe order must be respected.

Each mistake removes one life.

The score increases with each correct ingredient caught.

✨ Features

Weighted item spawn system (recipe ingredients appear more frequently)

HUD displaying score and remaining lives

Start screen and Game Over screen

Background music and sound effects

Blurred background during gameplay and Game Over

Simple UI animations

Clean separation between game logic and UI

🧩 Project Structure
├── index.html
├── styles.css
├── main.js
├── fallingItem.js
├── images/
│   ├── background.png
│   ├── icecubes.png
│   ├── pisco.png
│   ├── cola.png
│   └── ...
├── sounds/
│   ├── bg-music.mp3
│   ├── catch.mp3
│   ├── life-lost.mp3
│   └── game-over.mp3
└── README.md

🛠️ Technologies Used

HTML5

CSS3

JavaScript (ES6)

No external libraries or frameworks

🚀 How to Run the Project

Clone the repository:

git clone <repository-url>


Open index.html in your browser
(Using VS Code Live Server is recommended)

📚 Learning Objectives

This project was built to practice and reinforce:

DOM manipulation

JavaScript classes

Game state management

Timers (setInterval, setTimeout)

Basic collision handling

Code organization

UI/UX fundamentals for browser games

🔮 Possible Improvements

Progressive difficulty system

Persistent high score using localStorage

Mobile / touch controls

Additional animations and visual feedback

New recipes and game modes

👤 Author

Mauricio Rojas Morales
Web Development Student – Ironhack

🍹 Enjoy playing Pisco Rush!
