/** Game board */
let canvas;
/** Game board container in HTML */
let canvasDiv;
/** 4 sections on canvas to represent grids for 4-Snake */
let sec1;
let sec2;
let sec3;
let sec4;
/** Scale of the game (# of grids = (width * height / GRID_SCALE^2))*/
const GRID_SCALE = 20;

/** Enumerate framerate values as game difficulties selected by player */
const Difficulty = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 35,
  INSANE: 50
}
Object.freeze(Difficulty);

/**
 * Get the HTML container to place the canvas in before loading.
 */
function preload() {
  canvasDiv = document.getElementById('canvas-container');
}

/**
 * Setup the 4-way segmented grid for 4-Snake.
 */
function setup() {
  // Initialize the canvas (can only have 1 instance)
  canvas = createCanvas(floor(canvasDiv.offsetWidth), floor(canvasDiv.offsetHeight));
  // Set the encapsulating container of the canvas
  canvas.parent('canvas-container');
  // Resize the canvas based on container dimensions
  canvas = resizeCanvas(floor(canvasDiv.offsetWidth), floor(canvasDiv.offsetHeight));
  // Initialize the game upon setup
  initializeGame();
}

/**
 * Initializes the game by segmenting the canvas into 4 equal sections based on height
 * and width of the encapsulating container. Overlays game graphics over each section.
 * Creates a new Snake and instance of Food in each section.
 */
function initializeGame() {
  // Determine middle line boundaries of the canvas container
  const halfWidth = floor(canvasDiv.offsetWidth / 2);
  const halfHeight = floor(canvasDiv.offsetHeight / 2);

  createFourGameSections(halfWidth, halfHeight);

  createSnakeInEachGameSection(halfWidth, halfHeight);

  createFoodInEachGameSection(halfWidth, halfHeight);
}

/**
 * Create four game sections of equal size and different colors to
 * fit as a grid on the canvas.
 * @param {number} halfWidth A number representing half the width of the game container
 * @param {number} halfHeight A number representing half the height of the game container
 */
function createFourGameSections(halfWidth, halfHeight) {
  sec1 = createGraphics(halfWidth, halfHeight);
  sec1.background(123, 122, 211);
  sec2 = createGraphics(halfWidth, halfHeight);
  sec2.background(40, 74, 111);
  sec3 = createGraphics(halfWidth, halfHeight);
  sec3.background(243, 74, 111);
  sec4 = createGraphics(halfWidth, halfHeight);
  sec4.background(243, 255, 111);
}

/**
 * Creates a new snake in each game section and sets its initial 
 * location in the top left corner of each respective section.
 * @param {number} halfWidth A number representing half the width of the game container
 * @param {number} halfHeight A number representing half the height of the game container
 */
function createSnakeInEachGameSection(halfWidth, halfHeight) {
  sec1.snake = new Snake({
    x: 0, 
    y: 0, 
    xConstraint1: 0, 
    xConstraint2: halfWidth - GRID_SCALE, 
    yConstraint1: 0, 
    yConstraint2: halfHeight - GRID_SCALE, 
    gridScale: GRID_SCALE, 
    red: 255, 
    green: 0, 
    blue: 0
  });
  sec2.snake = new Snake({
    x: halfWidth, 
    y: 0, 
    xConstraint1: halfWidth, 
    xConstraint2: canvasDiv.offsetWidth - GRID_SCALE, 
    yConstraint1: 0, 
    yConstraint2: halfHeight - GRID_SCALE, 
    gridScale: GRID_SCALE, 
    red: 0, 
    green: 255, 
    blue: 0
  });
  sec3.snake = new Snake({
    x: 0, 
    y: halfHeight, 
    xConstraint1: 0, 
    xConstraint2: halfWidth - GRID_SCALE,
    yConstraint1: halfHeight,
    yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
    gridScale: GRID_SCALE, 
    red: 255, 
    green: 0, 
    blue: 255
  });
  sec4.snake = new Snake({
    x: halfWidth, 
    y: halfHeight, 
    xConstraint1: halfWidth, 
    xConstraint2: canvasDiv.offsetWidth - GRID_SCALE,
    yConstraint1: halfHeight,
    yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
    gridScale: GRID_SCALE, 
    red: 255, 
    green: 100, 
    blue: 100
  });
}

/**
 * Creates new food in each game section in a random location
 * @param {number} halfWidth A number representing half the width of the game container
 * @param {number} halfHeight A number representing half the height of the game container
 */
function createFoodInEachGameSection(halfWidth, halfHeight) {
  sec1.food = new Food({
    xConstraint1: 0, 
    xConstraint2: halfWidth - GRID_SCALE,
    yConstraint1: 0,
    yConstraint2: halfHeight - GRID_SCALE,
    gridScale: GRID_SCALE,
    section: 1
  });
  sec2.food = new Food({
    xConstraint1: halfWidth, 
    xConstraint2: canvasDiv.offsetWidth - GRID_SCALE,
    yConstraint1: 0,
    yConstraint2: halfHeight - GRID_SCALE,
    gridScale: GRID_SCALE,
    section: 2
  });
  sec3.food = new Food({
    xConstraint1: 0, 
    xConstraint2: halfWidth - GRID_SCALE,
    yConstraint1: halfHeight,
    yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
    gridScale: GRID_SCALE,
    section: 3
  });
  sec4.food = new Food({
    xConstraint1: halfWidth, 
    xConstraint2: canvasDiv.offsetWidth - GRID_SCALE,
    yConstraint1: halfHeight,
    yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
    gridScale: GRID_SCALE,
    section: 4
  });
}

/*
 * Resize the canvas and initialize the game again when the window gets resized.
 * Makes the game grid layout dynamic and ensures that the game can be played on 
 * different screen sizes comfortably.
 */
function windowResized() {
  canvas = resizeCanvas(floor(canvasDiv.offsetWidth), floor(canvasDiv.offsetHeight));
  initializeGame();
}

/*
 * Draw is continuously called to update the game. Detects changes in game
 * state, like game difficulty, snake death, snake eating, or key press to
 * change direction of snake. Updates every snake on call.
 */
function draw() {
  // If any Snake has died, then reset the game
  if (anySnakeDied()) {
    // No snake should be moving after initialization upon death
    keyCode = null;
    initializeGame();
    return;
  }

  // Make the canvas white
  background(255);

  setGameDifficulty();

  adjustSectionGraphicsBasedOnContainerDimensions();

  snakeKeyPressed();

  updateAndShowSnakes();

  checkIfSnakesAteFoodAndSpawnNewFood();

  setGameScore();

  showAllFood();
}

/**
 * Checks if a Snake in any section has died.
 * @return {boolean} True if any Snake has died, else false.
 */
function anySnakeDied() {
  return sec1.snake.death() || 
    sec2.snake.death() || 
    sec3.snake.death() || 
    sec4.snake.death();
}

/**
 * Sets the framerate based on difficulty selected by user.
 */
function setGameDifficulty() {
  const difficulty = document.getElementById('game-difficulty').value;
  switch (difficulty) {
    case "easy":
      frameRate(Difficulty.EASY);
      break;
    case "medium":
      frameRate(Difficulty.MEDIUM);
      break;
    case "hard":
      frameRate(Difficulty.HARD);
      break;
    case "insane":
      frameRate(Difficulty.INSANE);
      break;
    default:
      frameRate(Difficulty.EASY);
  }
}

/**
 * Adjusts the size of the graphics overlays in each section based on the
 * dimensions of the containing canvas div.
 */
function adjustSectionGraphicsBasedOnContainerDimensions() {
  const halfWidth = floor(canvasDiv.offsetWidth / 2);
  const halfHeight = floor(canvasDiv.offsetHeight / 2);

  image(sec1, 0, 0);
  image(sec2, halfWidth, 0);
  image(sec3, 0, halfHeight);
  image(sec4, halfWidth, halfHeight);
}

/**
 * Update the location of the snakes and show them on the screen.
 */
function updateAndShowSnakes() {
  sec1.snake.update();
  sec1.snake.show();

  sec2.snake.update();
  sec2.snake.show();

  sec3.snake.update();
  sec3.snake.show();

  sec4.snake.update();
  sec4.snake.show();
}

/**
 * Check if the Snakes ate the food in their section and if
 * they did, spawn new food in that section.
 */
function checkIfSnakesAteFoodAndSpawnNewFood() {
  const halfWidth = floor(canvasDiv.offsetWidth / 2);
  const halfHeight = floor(canvasDiv.offsetHeight / 2);

  if (sec1.snake.eat(sec1.food.x, sec1.food.y)) {
    sec1.food = new Food({
      xConstraint1: 0, 
      xConstraint2: halfWidth - GRID_SCALE,
      yConstraint1: 0,
      yConstraint2: halfHeight - GRID_SCALE,
      gridScale: GRID_SCALE,
      section: 1
    });
  }
  if (sec2.snake.eat(sec2.food.x, sec2.food.y)) {
    sec2.food = new Food({
      xConstraint1: halfWidth, 
      xConstraint2: canvasDiv.offsetWidth - GRID_SCALE,
      yConstraint1: 0,
      yConstraint2: halfHeight - GRID_SCALE,
      gridScale: GRID_SCALE,
      section: 2
    });
  }
  if (sec3.snake.eat(sec3.food.x, sec3.food.y)) {
    sec3.food = new Food({
      xConstraint1: 0, 
      xConstraint2: halfWidth - GRID_SCALE,
      yConstraint1: halfHeight,
      yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
      gridScale: GRID_SCALE,
      section: 3
    });
  }
  if (sec4.snake.eat(sec4.food.x, sec4.food.y)) {
    sec4.food = new Food({
      xConstraint1: halfWidth, 
      xConstraint2: canvasDiv.offsetWidth - GRID_SCALE,
      yConstraint1: halfHeight,
      yConstraint2: canvasDiv.offsetHeight - GRID_SCALE,
      gridScale: GRID_SCALE,
      section: 4
    });
  }
}

/**
 * Sets total score for game by calculating total length
 * of all the Snakes tails.
 */
function setGameScore() {
  const score = document.getElementById('score');
  score.innerHTML = "Score: " + (sec1.snake.total + sec2.snake.total + sec3.snake.total + sec4.snake.total);
}

/**
 * Shows the food in every game section on the screen.
 */
function showAllFood() {
  sec1.food.show();
  sec2.food.show();
  sec3.food.show();
  sec4.food.show();
}

/*
 * Checks if an arrow key is pressed and sets
 * the direction of each snake accordingly.
 */
function snakeKeyPressed() {
  if (keyCode === UP_ARROW) {
    sec1.snake.dir(0, -1);
    sec2.snake.dir(0, -1);
    sec3.snake.dir(0, -1);
    sec4.snake.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    sec1.snake.dir(0, 1);
    sec2.snake.dir(0, 1);
    sec3.snake.dir(0, 1);
    sec4.snake.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    sec1.snake.dir(1, 0);
    sec2.snake.dir(1, 0);
    sec3.snake.dir(1, 0);
    sec4.snake.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    sec1.snake.dir(-1, 0);
    sec2.snake.dir(-1, 0);
    sec3.snake.dir(-1, 0);
    sec4.snake.dir(-1, 0);
  }
}
