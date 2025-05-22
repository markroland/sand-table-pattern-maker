import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';

class SpinMorph {

  constructor(env) {
    this.key = this.constructor.name.toLowerCase();
    this.name = 'Spin Morph';
    this.env = env;

    this.max_r = 0.5 * Math.min(
      (env.table.x.max - env.table.x.min),
      (env.table.y.max - env.table.y.min)
    );

    this.config = {
      "radius": {
        "name": "Radius (r)",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            0.5 * Math.min(env.table.x.max, env.table.y.max),
            0.5 * this.max_r,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "angle": {
        "name": "Start Angle (𝜃)",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            360,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "reverse": {
        "name": "Reverse",
        "value": null,
        "input": {
          "type": "createCheckbox",
          "attributes" : [{
            "type" : "checkbox",
            "checked" : null
          }],
          "params": [0, 1, 0],
          "displayValue": false
        }
      }
    };

    this.path = [];
  }

  draw() {

    // Update object
    this.config.radius.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.angle.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.angle.value + '°';

    // Calculate path for Circle at center
    if (!this.path.length) {
      this.path = this.constructPath();
    }

    return this.path;
  }

  /**
   * Calculate coordinates for a circle
   **/
  constructPath() {

    // Start path at far right
    let path = [];

    const PathHelp = new PathHelper();



    let square = PathHelp.polygon(4, 0.5 * this.max_r);
    square = PathHelp.translatePath(square, [0.5 * this.max_r, 0]);

    let circle = PathHelp.polygon(60, 0.5 * this.max_r);
    circle = PathHelp.translatePath(circle, [0.5 * this.max_r, 0]);

    const i_max = 90;

    for (let i = 0; i < i_max; i++) {
      let square_i = PathHelp.deepCopy(square);
      square_i = PathHelp.rotatePath(square_i, (2 * Math.PI) *  (i / i_max));
      path = path.concat(square_i);
    }

    for (let i = 0; i < i_max; i++) {
      let square_i = PathHelp.deepCopy(square);
      square_i = PathHelp.rotatePath(square_i, (2 * Math.PI) *  (i / i_max));
      square_i = PathHelp.scalePath(square_i, 1 - i / i_max);

      let circle_i = PathHelp.deepCopy(circle);
      circle_i = PathHelp.rotatePath(circle_i, (2 * Math.PI) *  (i / i_max));
      circle_i = PathHelp.scalePath(circle_i, 1 - i / i_max);

      let morph = PathHelp.morph(square_i, circle_i, i / i_max);
      path = path.concat(morph);
    }
    // path = path.concat(square);

    // ---

    path = PathHelp.simplify(path, 0.33 * this.env.ball.diameter);

    path = PathHelp.reflectPath(path, "y");

    return path;
  }
}

export default SpinMorph;