/**
 * Model for snake in 4-Snake game. Constrained to move within certain bounds of a p5 canvas based on
 * passed constraints. Rendered based on the grid's scale. Directed using arrow-keys.
 */
class Snake {
<<<<<<< HEAD
    /**
     * @param {number} x Starting x-coordinate
     * @param {number} y Starting y-coordinate
     * @param {number} xConstraint1 First x-coordinate constraint
     * @param {number} xConstraint2 Second x-coordinate constraint
     * @param {number} yConstraint1 First y-coordinate constraint
     * @param {number} yConstraint2 Second y-coordinate constraint
     * @param {number} gridScale Scale of game grid that food will be rendered on
     * @param {number} red RGB code (0 - 255)
     * @param {number} green RGB code (0 - 255)
     * @param {number} blue RGB code (0 - 255)
     */
    constructor(x, y, xConstraint1, xConstraint2, yConstraint1, yConstraint2, gridScale, red, green, blue) {
        // The snake is not moving upon initialization
        // @private {number} Snake speed in the x-direction
        this.xSpeed = 0;
        // @private {number} Snake speed in the y-direction
        this.ySpeed = 0;

        // @private {Array<Vector>} Array of vectors representing each tail element of the snake
        this.tail = [];

        // @private {number} Total number of tail pieces
        this.total = 0;

        this.x = x;
        this.y = y;

        this.xConstraint1 = xConstraint1;
        this.xConstraint2 = xConstraint2;
        this.yConstraint1 = yConstraint1;
        this.yConstraint2 = yConstraint2;

        this.gridScale = gridScale;

        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Sets speed and direction of snake.k
     */
    dir(xSpeed, ySpeed) {
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    /**
     * Renders each tail element and head of the snake as rectangles on a p5 canvas.
     */
    show() {
        // Show all blocks in the tail
        for (let i = 0; i < this.tail.length; i++) {
            fill(this.red, this.green, this.blue);
            rect(this.tail[i].x, this.tail[i].y, this.gridScale, this.gridScale);
        }
        // Show the head
        fill(this.red, this.green, this.blue);
        rect(this.x, this.y, this.gridScale, this.gridScale);
    }

    /**
     * Determines if food at a certain x and y-coordinate are close enough to the
     * snake to be "eaten".
     * @return {boolean} True if close enough to be eaten, else false.
     */
    eat(foodX, foodY) {
        const distanceFromFood = dist(this.x, this.y, foodX, foodY);
        if (distanceFromFood < 10) {
            this.total++;
            return true;
        }
        return false;
    }

    /**
     * Determines if the head of the snake is touching any tail element. If it is, the snake is
     * killed by setting the total length of the tail to 0 and removing all vector tail elements.
     */
    death() {
=======
    /**
     * @param {number} x Starting x-coordinate
     * @param {number} y Starting y-coordinate
     * @param {number} xConstraint1 First x-coordinate constraint
     * @param {number} xConstraint2 Second x-coordinate constraint
     * @param {number} yConstraint1 First y-coordinate constraint
     * @param {number} yConstraint2 Second y-coordinate constraint
     * @param {number} gridScale Scale of game grid that food will be rendered on
     * @param {number} red RGB code (0 - 255)
     * @param {number} green RGB code (0 - 255)
     * @param {number} blue RGB code (0 - 255)
     */
    constructor({x, y, xConstraint1, xConstraint2, yConstraint1, yConstraint2, gridScale, red, green, blue}) {
        // The snake is not moving upon initialization
        // @private {number} Snake speed in the x-direction
        this.xSpeed = 0;
        // @private {number} Snake speed in the y-direction
        this.ySpeed = 0;

        // @private {Array<Vector>} Array of vectors representing each tail element of the snake
        this.tail = [];

        // @private {number} Total number of tail pieces
        this.total = 0;

        this.x = x;
        this.y = y;

        this.xConstraint1 = xConstraint1;
        this.xConstraint2 = xConstraint2;
        this.yConstraint1 = yConstraint1;
        this.yConstraint2 = yConstraint2;

        this.gridScale = gridScale;

        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
     * Sets speed and direction of snake.k
     */
    dir(xSpeed, ySpeed) {
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    /**
     * Renders each tail element and head of the snake as rectangles on a p5 canvas.
     */
    show() {
        // Show all blocks in the tail
        for (let i = 0; i < this.tail.length; i++) {
            fill(this.red, this.green, this.blue);
            rect(this.tail[i].x, this.tail[i].y, this.gridScale, this.gridScale);
        }
        // Show the head
        fill(this.red, this.green, this.blue);
        rect(this.x, this.y, this.gridScale, this.gridScale);
    }

    /**
     * Determines if food at a certain x and y-coordinate are close enough to the
     * snake to be "eaten".
     * @return {boolean} True if close enough to be eaten, else false.
     */
    eat(foodX, foodY) {
        const distanceFromFood = dist(this.x, this.y, foodX, foodY);
        if (distanceFromFood < 10) {
            this.total++;
            return true;
        }
        return false;
    }

    /**
     * Determines if the head of the snake is touching any tail element. If it is, the snake is
     * killed by setting the total length of the tail to 0 and removing all vector tail elements.
     */
    death() {
>>>>>>> Change positional parameters to named parameters in Snake class
        for (let i = 0; i < this.tail.length; i++) {
            const distanceFromThisTailElement = dist(this.x, this.y, this.tail[i].x, this.tail[i].y);
            if (distanceFromThisTailElement < 1) {
                this.total = 0;
                this.tail = [];
                break;
            }
        }
    }

    /**
     * Updates the position of the snake. If the snake has recently eaten food, i.e. total tail 
     * elements counter is greater than current length of the tail, then create a new tail element.
     * If the snake has reached a boundary and is moving in the direction of the boundary, update
     * the location of the snake to come out of the opposite boundary.
     */
    update() {
        // If the snake has reached a boundary and is moving in that direction, set it's position to be the opposite boundary
        if (this.x === this.xConstraint1 && this.xSpeed === -1 && this.ySpeed === 0) {
            this.x = this.xConstraint2;
        } else if (this.x === this.xConstraint2 && this.xSpeed === 1 && this.ySpeed === 0) {
            this.x = this.xConstraint1;
        } else if (this.y === this.yConstraint1 && this.xSpeed === 0 && this.ySpeed === -1) {
            this.y = this.yConstraint2;
        } else if (this.y === this.yConstraint2 && this.xSpeed === 0 && this.ySpeed === 1) {
            this.y = this.yConstraint1;
        }

        // If the snake didn't eat anything, shift the entire snake first
        if (this.total === this.tail.length) {
            // Shift the tail by 1 piece to make room for the snakes position one frame ago (new head of the tail)
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }
        }

        // Set the beginning of the tail to be the snake's position one frame ago
        this.tail[this.total - 1] = createVector(this.x, this.y);


        // Update the snake's position 
        this.x += this.xSpeed * this.gridScale;
        this.y += this.ySpeed * this.gridScale;

        // Constrain the snake to its own game section boundaries
        this.x = constrain(this.x, this.xConstraint1, this.xConstraint2);
        this.y = constrain(this.y, this.yConstraint1, this.yConstraint2);
    }
}
