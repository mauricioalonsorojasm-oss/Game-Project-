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

const recipe = ["ICE", "PISCO", "COLA"]; // winning recipe

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

// ===== LANES =====

const lanesCount = 3;
const padding = 180;

const playerWidth = 150;
const playerHeight = 80;
const playerBottomOffset = 14;

const itemWidth = 150;
const itemHeight = 150;

let laneX = [];
let playerLane = 1;

// ===== LANES HELPERS =====

function setupLanes() {
  const width = gameArea.clientWidth;
  const usable = width - padding * 2;
  const step = usable / (lanesCount - 1);

  laneX = [];
  for (let i = 0; i < lanesCount; i++) {
    const laneCenter = padding + step * i;
    laneX.push(laneCenter - playerWidth / 2);
  }
}

function getLaneLeft(lane, elementWidth) {
  const laneCenter = laneX[lane] + playerWidth / 2;
  return laneCenter - elementWidth / 2;
}

function placePlayer() {
  player.style.left = laneX[playerLane] + "px";
}

function initPlayer() {
  setupLanes();
  playerLane = 1;
  placePlayer();
}

// ===== RESIZE =====

window.addEventListener("resize", () => {
  if (laneX.length === 0) return;
  setupLanes();
  placePlayer();
});

// ===== INPUT =====

window.addEventListener("keydown", (e) => {
  if (gameUI.classList.contains("hidden")) return;

  if (e.key === "ArrowLeft") {
    playerLane = Math.max(0, playerLane - 1);
    placePlayer();
  }

  if (e.key === "ArrowRight") {
    playerLane = Math.min(lanesCount - 1, playerLane + 1);
    placePlayer();
  }
});

// ===== TIMERS / STATE =====

let spawnTimer = null;
let fallTimers = new Set(); // guarda intervals activos para limpieza global
let isRunning = false;

// ===== CLEANUP =====

function clearAllFalling() {
  fallTimers.forEach(clearInterval);
  fallTimers.clear();
  gameArea.querySelectorAll(".falling").forEach((el) => el.remove());
}

function stopSpawning() {
  if (spawnTimer) {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }
}

// ===== COLLISIONS (COORDENADAS PROPIAS) =====

function getPlayerBox() {
  return {
    x: laneX[playerLane],
    y: gameArea.clientHeight - playerHeight - playerBottomOffset,
    w: playerWidth,
    h: playerHeight,
  };
}

function getItemBox(top, lane) {
  return {
    x: getLaneLeft(lane, itemWidth),
    y: top,
    w: itemWidth,
    h: itemHeight,
  };
}

function isCaught(itemBox, playerBox) {
  const verticalHit = itemBox.y + itemBox.h >= playerBox.y;
  const horizontalHit =
    itemBox.x < playerBox.x + playerBox.w &&
    itemBox.x + itemBox.w > playerBox.x;

  return verticalHit && horizontalHit;
}

// ===== SPAWN + FALL =====

function spawnOneRandomItem() {
  if (laneX.length !== lanesCount) return;

  const type = getRandomItemType();
  const lane = Math.floor(Math.random() * lanesCount);

  const img = document.createElement("img");
  img.src = itemAssets[type];
  img.classList.add("falling");

  let top = 0;
  img.style.left = getLaneLeft(lane, itemWidth) + "px";
  img.style.top = "0px";

  gameArea.appendChild(img);

  const speed = 5;
  const interval = 20;

  const fallInterval = setInterval(() => {
    top += speed;
    img.style.top = top + "px";

    const itemBox = getItemBox(top, lane);
    const playerBox = getPlayerBox();

    if (isCaught(itemBox, playerBox)) {
      clearInterval(fallInterval);
      fallTimers.delete(fallInterval);
      img.remove();
      console.log("Caught:", type);
      return;
    }

    if (top > gameArea.clientHeight - 80) {
      clearInterval(fallInterval);
      fallTimers.delete(fallInterval);
      img.remove();
      console.log("Item missed");
    }
  }, interval);

  fallTimers.add(fallInterval);
}

// ===== GAME FLOW =====

function startGame() {
  if (isRunning) return;

  showOnly(gameUI);
  initPlayer();
  gameWrapper.classList.add("game-active");

  clearAllFalling();
  stopSpawning();

  isRunning = true;
  spawnOneRandomItem();
  spawnTimer = setInterval(spawnOneRandomItem, 1500);
}

function restartGame() {
  showOnly(startUI);
  stopSpawning();
  clearAllFalling();

  isRunning = false;
  laneX = [];
  gameWrapper.classList.remove("game-active");
}

// ===== BUTTONS =====

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// ===== INIT =====

showOnly(startUI);
