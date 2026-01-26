

// ===== DOM =====
const startUI = document.querySelector("#start-ui");
const gameUI = document.querySelector("#game-ui");
const gameOverUI = document.querySelector("#gameover-ui");

const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");

// Helper: show only one UI layer
function showOnly(layerToShow) {
  startUI.classList.add("hidden");
  gameUI.classList.add("hidden");
  gameOverUI.classList.add("hidden");

  layerToShow.classList.remove("hidden");
}

// Initial state
showOnly(startUI);

// Buttons
startBtn.addEventListener("click", () => {
  console.log("Start clicked");
  showOnly(gameUI);
});

restartBtn.addEventListener("click", () => {
  console.log("Restart clicked");
  showOnly(startUI);
});


// Recipe order
const Recipe = ["ICE", "PISCO", "COLA"];

// Assets for falling items
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
//console.log("itemTypes:", itemTypes);


// ===== PLAYER MOVEMENT =====
const gameArea = document.querySelector("#game-area");
const player = document.querySelector("#player");

let playerX = 0;
const speed = 50;
const playerRealWidth = 150; // px per key press

// Center player at start of game

function centerPlayer() {
  const areaWidth = gameArea.clientWidth;
  //const playerWidth = player.offsetWidth;

  playerX = (areaWidth - playerRealWidth) / 2;
  player.style.left = playerX + "px";
}

centerPlayer();

// Move player on keydown

window.addEventListener("keydown", (event) => {
  // Only allow movement when game UI is visible
  if (gameUI.classList.contains("hidden")) return;

  if (event.key === "ArrowLeft") {
    playerX -= speed;
  } else if (event.key === "ArrowRight") {
    playerX += speed;
  } else {
    return;
  }

  // Clamp inside bounds

  const minX = 150;
  const maxX = gameArea.clientWidth - playerRealWidth;

  if (playerX < minX) playerX = minX;
  if (playerX > maxX) playerX = maxX;

  player.style.left = playerX + "px";
});


startBtn.addEventListener("click", () => {
  console.log("Start clicked");
  showOnly(gameUI);
  centerPlayer();
});


function getRandomItemType() {
  const randomIndex = Math.floor(Math.random() * itemTypes.length);
  return itemTypes[randomIndex];
}

// console.log("Random:", getRandomItemType());
// console.log("Random:", getRandomItemType());
// console.log("Random:", getRandomItemType());



function spawnOneRandomItem() {
  const type = getRandomItemType();
  console.log("Spawning:", type);

  const img = document.createElement("img");
  img.src = itemAssets[type];
  img.alt = type;
  img.classList.add("falling");

  // posición simple (para test)
  img.style.left = "550px";
  img.style.top = "0px";

  gameArea.appendChild(img);
}

startBtn.addEventListener("click", () => {
  showOnly(gameUI);
  centerPlayer();

  spawnOneRandomItem(); // <-- test
});

