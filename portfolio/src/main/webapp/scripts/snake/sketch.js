/** Game board */
let cnv;
/** Game board container in HTML */
let cnvDiv;
/** 4 sections on canvas to represent grids for 4-Snake */
let sec1;
let sec2;
let sec3;
let sec4;
/** Scale of the game (# of grids = (width * height / GRID_SCALE^2))*/
const GRID_SCALE = 20;

/** Map selected game difficulty to framerate to change the "speed" of the game */
const difficultyMap = {
    'easy' : 10,
    'medium' : 20,
    'hard' : 35,
    'insane' : 50
}

/**
 * Get the HTML container to place the canvas in before loading.
 */
function preload() {
    cnvDiv = document.getElementById('canvas-container');
}

/**
 * Setup the 4-way segmented grid for 4-Snake.
 */
function setup() {
    // Initialize the canvas (can only have 1 instance)
    cnv = createCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
    // Set the encapsulating container of the canvas
    cnv.parent('canvas-container');
    // Resize the canvas based on container dimensions
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
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
    const halfWidth = floor(cnvDiv.offsetWidth / 2);
    const halfHeight = floor(cnvDiv.offsetHeight / 2);

    // Create 4 game sections of equal size and different colors to fit as a grid on the canvas  
    sec1 = createGraphics(halfWidth, halfHeight);
    sec1.background(123, 122, 211);
    sec2 = createGraphics(halfWidth, halfHeight);
    sec2.background(40, 74, 111);
    sec3 = createGraphics(halfWidth, halfHeight);
    sec3.background(243, 74, 111);
    sec4 = createGraphics(halfWidth, halfHeight);
    sec4.background(243, 255, 111);

    // Create a new snake for each section and set it in the top left corner of the section
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
        xConstraint2: cnvDiv.offsetWidth - GRID_SCALE, 
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
        yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
        gridScale: GRID_SCALE, 
        red: 255, 
        green: 0, 
        blue: 255
    });
    sec4.snake = new Snake({
        x: halfWidth, 
        y: halfHeight, 
        xConstraint1: halfWidth, 
        xConstraint2: cnvDiv.offsetWidth - GRID_SCALE,
        yConstraint1: halfHeight,
        yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
        gridScale: GRID_SCALE, 
        red: 255, 
        green: 100, 
        blue: 100
    });

    // Initialize new food in each section based on the section's constraints 
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
        xConstraint2: cnvDiv.offsetWidth - GRID_SCALE,
        yConstraint1: 0,
        yConstraint2: halfHeight - GRID_SCALE,
        gridScale: GRID_SCALE,
        section: 2
    });
    sec3.food = new Food({
        xConstraint1: 0, 
        xConstraint2: halfWidth - GRID_SCALE,
        yConstraint1: halfHeight,
        yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
        gridScale: GRID_SCALE,
        section: 3
    });
    sec4.food = new Food({
        xConstraint1: halfWidth, 
        xConstraint2: cnvDiv.offsetWidth - GRID_SCALE,
        yConstraint1: halfHeight,
        yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
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
    cnv = resizeCanvas(floor(cnvDiv.offsetWidth), floor(cnvDiv.offsetHeight));
    initializeGame();
}

/*
 * Draw is continuously called to update the game. Detects changes in game
 * state, like game difficulty, snake death, snake eating, or key press to
 * change direction of snake. Updates every snake on call.
 */
function draw() {
    // If any Snake has died, then reset the game
    if (sec1.snake.death() || sec2.snake.death() || sec3.snake.death() || sec4.snake.death()) {
        // No snake should be moving after initialization upon death
        keyCode = null;
        initializeGame();
        return;
    }

    // Make the canvas white
    background(255);

    // Set the frame rate based on difficulty
    const diff = document.getElementById('game-difficulty').value;
    frameRate(difficultyMap[diff]);

    // Determine middle line boundaries of the canvas container
    const halfWidth = floor(cnvDiv.offsetWidth / 2);
    const halfHeight = floor(cnvDiv.offsetHeight / 2);

    // Display the graphics overlays in the right locations 
    image(sec1, 0, 0);
    image(sec2, halfWidth, 0);
    image(sec3, 0, halfHeight);
    image(sec4, halfWidth, halfHeight);

    // Check if an arrow key is being pressed to move the snakes
    snakeKeyPressed();

    // Update the location of the snakes and show them on the screen
    sec1.snake.update();
    sec1.snake.show();

    sec2.snake.update();
    sec2.snake.show();

    sec3.snake.update();
    sec3.snake.show();

    sec4.snake.update();
    sec4.snake.show();

    // If the snakes ate food, then spawn new food in a different random location 
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
            xConstraint2: cnvDiv.offsetWidth - GRID_SCALE,
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
            yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
            gridScale: GRID_SCALE,
            section: 3
        });
    }
    if (sec4.snake.eat(sec4.food.x, sec4.food.y)) {
        sec4.food = new Food({
            xConstraint1: halfWidth, 
            xConstraint2: cnvDiv.offsetWidth - GRID_SCALE,
            yConstraint1: halfHeight,
            yConstraint2: cnvDiv.offsetHeight - GRID_SCALE,
            gridScale: GRID_SCALE,
            section: 4
        });
    }

    // The total score is the total length of the snake's tails
    const score = document.getElementById('score');
    score.innerHTML = "Score: " + (sec1.snake.total + sec2.snake.total + sec3.snake.total + sec4.snake.total);

    // Show the food overlays
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
