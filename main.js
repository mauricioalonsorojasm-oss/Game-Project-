// ======= DOM ELEMENTS =======
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");
const gameoverScreen = document.querySelector("#gameover-screen");

const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");

const gameArea = document.querySelector("#game-area");
const playerEl = document.querySelector("#player");

const scoreEl = document.querySelector("#score");
const nextStepEl = document.querySelector("#next-step");
const livesContainer = document.querySelector("#lives");


//console.log("JS connected!");


// ======= GAME SETTINGS =======
const GAME_WIDTH = 900; // same as CSS width (approx). We'll also use gameArea.clientWidth.
const PLAYER_SPEED = 8; // pixels per frame
const ITEM_SPEED = 4;   // pixels per frame
const SPAWN_MS = 900;   // spawn every 0.9s

// Recipe order
const RECIPE = ["ICE", "PISCO", "COLA"];

// Assets for falling items
const ITEM_ASSETS = {
  ICE: "images/icecubes.png",
  PISCO: "images/pisco.png",
  COLA: "images/cola.png",
  TEQUILA: "images/tequila.png",
};

