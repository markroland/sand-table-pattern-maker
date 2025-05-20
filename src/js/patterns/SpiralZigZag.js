import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';

class SpiralZigZag {

  constructor(env) {
    this.key = this.constructor.name.toLowerCase();
    this.name = this.constructor.name;
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
    let path = [
    ];

    const PathHelp = new PathHelper();

    // path = PathHelp.polygon(120, this.config.radius.value);
    const revolutions = 9;
    let spiral = Utilities.spiral(
      this.max_r - this.env.ball.diameter,
      this.max_r - revolutions * 2 * this.env.ball.diameter,
      revolutions,
      120
    );

    path = Utilities.zigZag(spiral, this.env.ball.diameter);

    path.shift();

    path = [[this.max_r, 0]].concat(path);

    // path = spiral;

    // path = path.concat(
    // // console.log(
    //   Utilities.arcBetweenPoints(
    //     path[path.length - 1][0],
    //     path[path.length - 1][1],
    //     0,
    //     0.5 * this.env.table.y.max,
    //     this.env.ball.diameter
    //   )
    // )


    // ---

    path = PathHelp.reflectPath(path, "y");

    return path;
  }
}

export default SpiralZigZag;