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

const itemTypes = Object.keys(itemAssets);

function getRandomItemType() {
  return itemTypes[Math.floor(Math.random() * itemTypes.length)];
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

// ===== DIMENSIONS =====

const playerWidth = 150;
const playerHeight = 80;
const playerBottomOffset = 14;

const itemWidth = 150;
const itemHeight = 150;

// ===== PLAYER =====

function placePlayer() {
  player.style.left = laneX[playerLane] + "px";
}

function initPlayer() {
  playerLane = 1;
  placePlayer();
}

// ===== INPUT (BEGINNER FRIENDLY) =====

function moveLeft() {
  playerLane = Math.max(0, playerLane - 1);
  placePlayer();
}

function moveRight() {
  playerLane = Math.min(lanesCount - 1, playerLane + 1);
  placePlayer();
}

function handleKeyDown(e) {
  if (!isRunning) return;

  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  }
}

document.addEventListener("keydown", handleKeyDown);

// ===== SPAWN TIMER =====

let spawnTimer = null;

// ===== CLEANUP =====

function clearAllFalling() {
  gameArea.querySelectorAll(".falling").forEach((el) => el.remove());
}

function stopSpawning() {
  if (spawnTimer) {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }
}

// ===== COLLISIONS =====

function getPlayerBox() {
  return {
    x: laneX[playerLane],
    y: gameArea.clientHeight - playerHeight - playerBottomOffset,
    w: playerWidth,
    h: playerHeight,
  };
}

function isCaught(itemBox, playerBox) {
  const verticalHit = itemBox.y + itemBox.h >= playerBox.y;
  const horizontalHit =
    itemBox.x < playerBox.x + playerBox.w &&
    itemBox.x + itemBox.w > playerBox.x;

  return verticalHit && horizontalHit;
}

// ===== GAME RULES =====

// function handleCatch(type) {
//   const expectedType = recipe[recipeStep];

// 

// function handleMiss() {
//  

// ===== SPAWN + FALL  =====

function getRandomLane() {
  return Math.floor(Math.random() * lanesCount);
}

function createFallingImage(type, lane) {
  const img = document.createElement("img");
  img.src = itemAssets[type];
  img.classList.add("falling");

  img.style.left = laneX[lane] + "px";
  img.style.top = "0px";

  gameArea.appendChild(img);
  return img;
}

function moveDown(img, currentTop) {
  const newTop = currentTop + 5;
  img.style.top = newTop + "px";
  return newTop;
}

function wasCaught(lane, top) {
  const itemBox = {
    x: laneX[lane],
    y: top,
    w: itemWidth,
    h: itemHeight,
  };

  const playerBox = getPlayerBox();
  return isCaught(itemBox, playerBox);
}

function wasMissed(top) {
  return top > gameArea.clientHeight - 80;
}

function removeItem(img, intervalId) {
  clearInterval(intervalId);
  img.remove();
}

function spawnOneRandomItem() {
  const type = getRandomItemType();
  const lane = getRandomLane();

  const img = createFallingImage(type, lane);
  let top = 0;

  const fallInterval = setInterval(() => {
    top = moveDown(img, top);

  }, 20);
}

// ===== GAME FLOW =====

function startGame() {
  if (isRunning) return;

  score = 0;
  lives = 3;
  recipeStep = 0;

  showOnly(gameUI);
  initPlayer();
  gameWrapper.classList.add("game-active");

  clearAllFalling();
  stopSpawning();

  isRunning = true;
  spawnOneRandomItem();
  spawnTimer = setInterval(spawnOneRandomItem, 1500);
}

function endGame() {
  stopSpawning();
  clearAllFalling();
  isRunning = false;
  gameWrapper.classList.remove("game-active");
  showOnly(gameOverUI);
}

function restartGame() {
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
