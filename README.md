# Game-Project-
This repository is for my first game project in JS


+++ Game concept +++

You control an empty glass that moves left/right at the bottom. Ingredients fall from the top.
Your goal is to catch the recipe in the correct order:

Recipe (Piscola):

Ice → 2) Pisco → 3) Coca-Cola

When you complete the sequence in order: +1 point and the recipe progress resets.

Fail rules:

Catching the right items in the wrong order → fail → lose 1 life → reset recipe progress

Catching a wrong alcohol (e.g., Tequila) → automatic fail → lose 1 life → reset recipe progress


+++  App states (3+) +++

START -> GAME -> WIN
           \-> LOSE
WIN/LOSE -> Restart -> START


++++ State details ++++
 
START

Title: “Make the Perfect Piscola”

Instructions: “Catch Ice → Pisco → Coca-Cola (in that order)”

Start button

GAME

Game area + HUD: Lives, Score, Current Step (e.g. “Step 1/3: Ice”)

WIN

“Bartender level: unlocked!”

Show score

Restart button

LOSE

“Glass shattered!” / “Wrong mix!”

Restart button

Win condition ideas

Score target (e.g. 5 piscolas) OR survive time (e.g. 45s)


++++ Layout: where game elements are +++

+--------------------------------------------------+
| Lives: 3    Score: 0    Recipe: ICE (1/3)        |
+--------------------------------------------------+
|                                                  |
|        falling items: 🧊  🥃  🥤  🍋  🍸           |
|                                                  |
|                                                  |
|                                                  |
|                   [   GLASS   ]                  |
+--------------------------------------------------+
| Controls: ← →                                    |
+--------------------------------------------------+

Glass stays near bottom

Items spawn randomly at top, fall down

HUD shows the next required ingredient (super important UX)




+++ Movement of elements +++

Glass movement

Keyboard: ArrowLeft / ArrowRight

Smooth movement while key held

Clamp inside game area

Falling items

Each item has:

type (ICE / PISCO / COKE / TEQUILA / etc.)

x, y, speed, size

Each frame: y += speed

If out of bounds: remove item

Game loop

requestAnimationFrame recommended

Separate concerns:

update() (movement, collisions, state checks)

render() (DOM styles)


+++ Essential functionalities (MVP) +++

State switching (start/game/win/lose + restart)

Glass movement left/right (keyboard)

Spawn falling items at interval with random X

Falling physics (y increases each frame)

Collision detection item vs glass

Recipe progress system (ICE → PISCO → COKE)

Lives system (fail costs 1 life)

Score system (+1 on completed recipe)

HUD updates (show lives, score, next required ingredient)

Cleanup on restart (stop intervals/RAF, clear items, reset vars)




+++ Bonus functionalities +++


Combo / streak: extra points for consecutive successful recipes without fails

Sound effects: catch / fail / success



+++ Classes structure (DOM + Classes friendly) +++
Game

Responsibilities: state, loop, spawning, HUD, win/lose, recipe logic

Props:

state

player (Glass)

items[]

score, lives

recipe = ["ICE","PISCO","COKE"]

recipeIndex = 0

spawnIntervalId, rafId, lastTimestamp

Methods:

start()

update(delta)

render()

spawnItem()

handleCatch(item) ← recipe logic lives here

fail(reason)

completeRecipe()

endWin() / endLose()

reset() / stop()

Glass (Player)

Responsibilities: horizontal movement + DOM element

Props: x, y, width, speed, direction, domEl

Methods:

setDirection(-1|0|1)

update(delta, boundsWidth)

render()

getRect()

FallingItem

Responsibilities: represents any falling ingredient

Props: type, x, y, size, speed, domEl

Methods:

update(delta)

render()

isOut(height)

getRect()

(Optionally extend into IngredientItem vs ForbiddenAlcoholItem, but not necessary for MVP.)
