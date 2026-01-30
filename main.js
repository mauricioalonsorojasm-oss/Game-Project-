// ===== DOM =====

const startUI = document.querySelector("#start-ui");
const gameUI = document.querySelector("#game-ui");
const gameOverUI = document.querySelector("#gameover-ui");

const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");

const gameArea = document.querySelector("#game-area");
const player = document.querySelector("#player");
const gameWrapper = document.querySelector("#game-wrapper");

// ===== UI HELPERS =====

function showOnly(layerToShow) {
  startUI.classList.add("hidden");
  gameUI.classList.add("hidden");
  gameOverUI.classList.add("hidden");
  layerToShow.classList.remove("hidden");
}

// ====== HUD References ====
const scoreEl = document.querySelector("#score");
const livesEl = document.querySelector("#lives");
const finalScoreValueEl = document.querySelector("#final-score-value");

// ===== SOUND EFFECTS =====

const soundCatch = new Audio("sounds/catch.mp3");
const soundLifeLost = new Audio("sounds/life-lost.mp3");
const soundGameOver = new Audio("sounds/game-over.mp3");
const soundGameStart = new Audio("sounds/game-start.mp3");
soundCatch.volume = 0.4;
soundLifeLost.volume = 0.4;
soundGameOver.volume = 0.5;
soundGameStart.volume = 0.5;

// ===== BACKGROUND MUSIC =====

const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true; // repeat forever
bgMusic.volume = 0.2; // softer than effects

// ===== PLAYSOUND FUNCTION =====

function playSound(sound) {
  sound.currentTime = 0; // rewind if played recently
  sound.play();
}
// ===== GAME DATA =====

const recipe = ["ICE", "PISCO", "COLA"];

const itemAssets = {
  ICE: "images/icecubes.png",
  PISCO: "images/pisco.png",
  COLA: "images/cola.png",
  TEQUILA: "images/tequila.png",
  VODKA: "images/vodka.png",
  WHISKY: "images/whisky.png",
  VERMOUTH: "images/vermouth.png",
  GIN: "images/gin.png",
  FERNET: "images/fernet.png",
};

//const itemTypes = Object.keys(itemAssets);

const spawnPool = [
  // Recipe items (más probables)
  "ICE",
  "ICE",
  "ICE",
  "ICE",
  "PISCO",
  "PISCO",
  "PISCO",
  "PISCO",
  "COLA",
  "COLA",
  "COLA",
  "COLA",

  // Forbidden items (menos probables)
  "TEQUILA",
  "VODKA",
  "WHISKY",
  "VERMOUTH",
  "GIN",
  "FERNET",
];

function getRandomItemType() {
  return spawnPool[Math.floor(Math.random() * spawnPool.length)];
}

// ===== GAME STATE =====

let score = 0;
let lives = 3;
let recipeStep = 0;
let isRunning = false;

// ===== LANES (FIXED) =====

const laneX = [300, 660, 1020];
const lanesCount = laneX.length;

let playerLane = 1;

// ===== DIMENSIONS (USED BY CLASS) =====

const playerWidth = 150;
const playerHeight = 80;
const playerBottomOffset = 14;

const itemHeight = 150;

// ===== PLAYER =====

function placePlayer() {
  player.style.left = laneX[playerLane] + "px";
}

function initPlayer() {
  playerLane = 1;
  placePlayer();
}

// ===== INPUT =====

function moveLeft() {
  playerLane = Math.max(0, playerLane - 1);
  placePlayer();
}

function moveRight() {
  playerLane = Math.min(lanesCount - 1, playerLane + 1);
  placePlayer();
}

document.addEventListener("keydown", (e) => {
  if (!isRunning) return;

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

// ===== HUD =====

function updateHUD() {
  scoreEl.textContent = score;

  livesEl.innerHTML = "";
  for (let i = 0; i < lives; i++) {
    const img = document.createElement("img");
    img.src = "images/LifeGlass.png";
    img.alt = "life";
    livesEl.appendChild(img);
  }
}

// ===== GAME RULES =====

function handleCatch(type) {
  const expectedType = recipe[recipeStep];

  // Forbidden item
  if (!recipe.includes(type)) {
    lives--;
    playSound(soundLifeLost);
    updateHUD();
    if (lives <= 0) endGame();
    return;
  }

  // Wrong order
  if (type !== expectedType) {
    lives--;
    playSound(soundLifeLost);
    updateHUD();
    if (lives <= 0) endGame();
    return;
  }

  // Correct item
  score++;
  playSound(soundCatch);
  updateHUD();
  recipeStep++;

  // Recipe completed → restart sequence
  if (recipeStep === recipe.length) {
    recipeStep = 0;
  }
}

function handleMiss(type) {
  const expectedType = recipe[recipeStep];

  // Missing forbidden items is OK
  if (!recipe.includes(type)) return;

  // Missing a recipe item but not the expected one is OK
  if (type !== expectedType) return;

  // Missed expected item
  lives--;
  playSound(soundLifeLost);
  updateHUD();
  if (lives <= 0) endGame();
}

// ===== SPAWN =====

let spawnTimer = null;

function spawnOneRandomItem() {
  const type = getRandomItemType();
  const lane = Math.floor(Math.random() * lanesCount);

  new FallingItem(type, lane);
}

function stopSpawning() {
  if (spawnTimer) {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }
}

function clearAllFalling() {
  gameArea.querySelectorAll(".falling").forEach((el) => el.remove());
}

// ===== GAME FLOW =====

function startGame() {
  if (isRunning) return;
  bgMusic.currentTime = 0;
  setTimeout(() => {
    bgMusic.play();
  }, 2000);

  playSound(soundGameStart);
  showOnly(gameUI);
  score = 0;
  lives = 3;
  recipeStep = 0;
  updateHUD();
  initPlayer();
  gameWrapper.classList.add("game-active");

  clearAllFalling();
  stopSpawning();

  isRunning = true;
  spawnOneRandomItem();
  spawnTimer = setInterval(spawnOneRandomItem, 1500);
}

function endGame() {
  playSound(soundGameOver);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  stopSpawning();
  clearAllFalling();
  isRunning = false;

  finalScoreValueEl.textContent = score;

  showOnly(gameOverUI);
}

function restartGame() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  showOnly(startUI);
  stopSpawning();
  clearAllFalling();
  isRunning = false;
  gameWrapper.classList.remove("game-active");
}

// ===== BUTTONS =====

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// ===== INIT =====

showOnly(startUI);
