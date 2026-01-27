// ===== DOM =====

const startUI = document.querySelector("#start-ui");
const gameUI = document.querySelector("#game-ui");
const gameOverUI = document.querySelector("#gameover-ui");

const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");

const gameArea = document.querySelector("#game-area");
const player = document.querySelector("#player");

// ===== UI HELPERS =====

function showOnly(layerToShow) {
  startUI.classList.add("hidden");
  gameUI.classList.add("hidden");
  gameOverUI.classList.add("hidden");
  layerToShow.classList.remove("hidden");
}

// ===== GAME DATA =====

const Recipe = ["ICE", "PISCO", "COLA"]; // combinacion correcta 

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
  const i = Math.floor(Math.random() * itemTypes.length);
  return itemTypes[i];
}

// ===== 3 LANES LOGIC =====

const LANES = 3;
const padding = 180;     // espacio a los bordes
const PLAYER_W = 150;    // same as CSS
const ITEM_W = 150;      // same as CSS

let laneX = [];          // posiciones left para cada lane
let playerLane = 1;      // 0=izq, 1=centro, 2=der

function setupLanes() {
  const w = gameArea.clientWidth;
  const usable = w - padding * 2;
  const step = usable / (LANES - 1);

  laneX = [];
  for (let i = 0; i < LANES; i++) {
    const laneCenter = padding + step * i;
    const left = laneCenter - PLAYER_W / 2;
    laneX.push(left);
  }
}

function placePlayer() {
  player.style.left = laneX[playerLane] + "px";
}

function initPlayer() {
  setupLanes();
  playerLane = 1; // centro
  placePlayer();
}

// Recalcular lanes si cambia tamaño de ventana
window.addEventListener("resize", () => {
  if (laneX.length === 0) return; // si aún no empezó el juego
  setupLanes();
  placePlayer();
});

// ===== PLAYER INPUT (SOLO 1 LISTENER) =====

window.addEventListener("keydown", (e) => {
  if (gameUI.classList.contains("hidden")) return;

  if (e.key === "ArrowLeft") {
    playerLane = Math.max(0, playerLane - 1);
    placePlayer();
  }

  if (e.key === "ArrowRight") {
    playerLane = Math.min(2, playerLane + 1);
    placePlayer();
  }
});

// ===== TIMERS / STATE =====

let spawnTimer = null;
let fallTimers = new Set(); // intervals de cada item para poder limpiarlos
let isRunning = false;

// ===== HELPERS =====

function clearAllFalling() {
  // detener todos los intervals de caída
  fallTimers.forEach((id) => clearInterval(id));
  fallTimers.clear();

  // borrar elementos
  gameArea.querySelectorAll(".falling").forEach((el) => el.remove());
}

function stopSpawning() {
  if (spawnTimer !== null) {
    clearInterval(spawnTimer);
    spawnTimer = null;
  }
}

// ===== SPAWN (3 LANES) + FALL =====

function spawnOneRandomItem() {

  // seguridad: si aún no hay lanes, no spawnear
  if (laneX.length !== LANES) return;

  const type = getRandomItemType();
  const lane = Math.floor(Math.random() * LANES);

  const img = document.createElement("img");
  img.src = itemAssets[type];
  img.alt = type;
  img.classList.add("falling");

  // metadata para colisiones
  //img.dataset.type = type;
  //img.dataset.lane = String(lane);

  // posicionar en el lane
  const laneCenter = laneX[lane] + PLAYER_W / 2;
  const left = laneCenter - ITEM_W / 2;

  img.style.left = left + "px";
  img.style.top = "0px";

  gameArea.appendChild(img);

  // ===== FALLING LOGIC =====
  let top = 0;
  const speed = 5;        // px por tick
  const interval = 20;    // ms

  const fallInterval = setInterval(() => {
    top += speed;
    img.style.top = top + "px";

    // si llega al fondo
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
  // evita duplicar start si ya está corriendo
  if (isRunning) return;

  showOnly(gameUI);
  initPlayer();
  isRunning = true;

  // limpiar cualquier residuo por seguridad
  clearAllFalling();
  stopSpawning();

  // spawnea 1 y luego arranca interval
  spawnOneRandomItem();
  spawnTimer = setInterval(spawnOneRandomItem, 1500);
}

function restartGame() {
  // volver al start UI
  showOnly(startUI);

  // parar todo lo del juego
  stopSpawning();
  clearAllFalling();
  isRunning = false;

  // reset lanes 
  laneX = [];
}

// ===== BUTTONS (SOLO 1 CADA UNO) =====

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// ===== INIT =====
showOnly(startUI);
