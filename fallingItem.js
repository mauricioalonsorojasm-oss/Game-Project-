// fallingItem.js

class FallingItem {
  constructor(type, lane) {
    this.type = type;
    this.lane = lane;
    this.top = 0;

    // create DOM element
    this.img = document.createElement("img");
    this.img.src = itemAssets[type];
    this.img.classList.add("falling");

    this.img.style.left = laneX[lane] + "px";
    this.img.style.top = "0px";

    gameArea.appendChild(this.img);

    // start falling
    this.intervalId = setInterval(() => {
      this.update();
    }, 20);
  }

  update() {
    this.moveDown();

    const playerTop =
      gameArea.clientHeight - playerHeight - playerBottomOffset;

    const sameLaneAsPlayer = this.lane === playerLane;
    const reachedPlayer = this.top + itemHeight >= playerTop;

    // CAUGHT: same lane + reached player
    if (sameLaneAsPlayer && reachedPlayer) {
      this.destroy();
      handleCatch(this.type);
      return;
    }

    // MISSED: reached bottom
    if (this.top > gameArea.clientHeight - 80) {
      this.destroy();
      handleMiss(this.type);
    }
  }

  moveDown() {
    this.top += 5;
    this.img.style.top = this.top + "px";
  }

  destroy() {
    clearInterval(this.intervalId);
    this.img.remove();
  }
}
