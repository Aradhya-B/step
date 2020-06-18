/**
 * Model for food in basic snake game. Constrained to certain coordinates on p5 canvas based
 * on section number and passed coordinate constraints. Rendered based on the grid's scale.
 */
class Food {
  /**
   * @param {number} xConstraint1 First x-coordinate constraint
   * @param {number} xConstraint2 Second x-coordinate constraint
   * @param {number} yConstraint1 First y-coordinate constraint
   * @param {number} yConstraint2 Second y-coordinate constraint
   * @param {number} gridScale Scale of game grid that food will be rendered on
   * @param {number} section Which section of 4-way segmented game grid this food should be rendered on
   */
  constructor({xConstraint1, xConstraint2, yConstraint1, yConstraint2, gridScale, section}) {
    this.xConstraint1 = xConstraint1;
    this.xConstraint2 = xConstraint2;
    this.yConstraint1 = yConstraint1;
    this.yConstraint2 = yConstraint2;
    this.gridScale = gridScale;
    this.section = section;

    /** @private {number} X-coordinate */
    this.x = this.setXLocation();
    /** @private {number} Y-coordinate */
    this.y = this.setYLocation();
  }

  /**
   * Randomly generates an x-coordinate for food based on given constraints and scale.
   * @return {number} X-coordinate
   */
  setXLocation() {
    // Computer the number of hidden columns on the constrained grid based on scale
    const cols = floor((this.xConstraint2 - this.xConstraint1) / this.gridScale);
    // Randomly select a column, ensure it's a whole number, and apply scale
    let scaledCols = floor(random(cols)) * this.gridScale;
    // If the section this food is to be generated on is on the right side of the entire
    // grid, then shift the food right by the left constraint
    if (this.section === 2 || this.section === 4) return scaledCols += this.xConstraint1;
    return scaledCols;
  } 

  /**
   * Randomly generates a y-coordinate for food based on given constraints and scale.
   * @return {number} Y-coordinate
   */
  setYLocation() {
    // Computer the number of hidden rows on the constrained grid based on scale
    const rows = floor((this.yConstraint2 - this.yConstraint1) / this.gridScale);
    // Randomly select a row, ensure it's a whole number, and apply scale
    let scaledRows = floor(random(rows)) * this.gridScale;
    // If the section this food is to be generated on is on the bottom side of the entire
    // grid, then shift the food down by the top constraint
    if (this.section === 3 || this.section === 4) return scaledRows += this.yConstraint1;
    return scaledRows;
  }

  /**
   * Renders the food as a blue rectangle on a p5 canvas
   */
  show() {
    // Food is blue by default
    fill(0, 0, 255);
    rect(this.x, this.y, this.gridScale, this.gridScale);
  }
}
