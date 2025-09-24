import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';

class SineWaves {

  constructor(env) {
    this.key = this.constructor.name.toLowerCase();
    this.name = "Sine Waves";
    this.env = env;

    this.max_r = 0.5 * Math.min(
      (env.table.x.max - env.table.x.min),
      (env.table.y.max - env.table.y.min)
    );

    this.config = {
      "lineCount": {
        "name": "Line Count",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            10,
            200,
            50,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "amplitude": {
        "name": "Amplitude (% of R)",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0.0,
            0.25,
            0.1,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "vertPeriods": {
        "name": "Vert Periods",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            10,
            2.5,
            0.5
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "horPeriods": {
        "name": "Hor Periods",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            10,
            2.5,
            0.5
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

    this.path = [];
  }

  draw() {

    // Update object
    this.config.lineCount.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.amplitude.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.vertPeriods.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.horPeriods.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.lineCount.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.amplitude.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.vertPeriods.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.horPeriods.value;

    // Construct the path
    this.path = this.constructPath();

    // Simplify decimal precision
    this.path = this.path.map(function(point) {
      return point.map(function(number) {
        return parseFloat(number.toFixed(2));
      });
    });

    return this.path;
  }

  /**
   * Build the path
   **/
  constructPath() {

    // Start path at far right
    let path = [
      [this.max_r, 0]
    ];

    const PathHelp = new PathHelper();

    const i_max = this.config.lineCount.value;
    const max_amplitude = this.config.amplitude.value * this.max_r;
    const x_min_bound = -(this.max_r + max_amplitude);
    const x_max_bound = this.max_r + max_amplitude;
    const vertPeriods = this.config.vertPeriods.value;
    const horPeriods = this.config.horPeriods.value;

    // Define the crop shape
    // const cropShape = PathHelp.polygon(120, this.max_r);

    for (let i = 1; i < i_max; i++) {

      // Set the amplitude of the sine wave, varying with the iteration
      const amplitude = max_amplitude * Math.sin( horPeriods * (i / i_max) * 2 * Math.PI);

      // Create a sine wave (starts at origin)
      let subpath = Utilities.sineWave(2 * this.max_r, amplitude, vertPeriods, 0.0, 120);

      // Rotate the path so that it is vertical
      subpath = PathHelp.rotatePath(subpath, 0.5 * Math.PI);

      // Translate the path to a new column, based on the iteration
      const x = PathHelp.map(i, 0, i_max, x_max_bound, x_min_bound);
      subpath = PathHelp.translatePath(subpath, [x, -this.max_r]);

      // Alternate the direction with each iteration
      if (i % 2) {
        subpath.reverse();
      }

      // Crop method 1: Remove points that are outside the radius of the table
      if (this.env.table.format == "polar") {
        subpath = subpath.filter(([x, y]) => Math.sqrt(x * x + y * y) <= this.max_r);
      }

      // Crop method 2: Crop the lines to a circle
      // subpath = PathHelp.cropToShape([subpath], cropShape)[0];

      // Create an arc on the perimeter of the table between iterations
      /*
      if (this.env.table.format == "polar") {
        if (path.length) {
          let connectionPath = Utilities.arcBetweenPoints(
            ...path[path.length - 1],
            ...subpath[0],
            12
          );
          // path.push(connectionPath);
          path = path.concat(connectionPath);
        }
      }
      //*/

      path = path.concat(subpath);
    }

    // Return to home to be a valid THR track
    if (this.env.table.format == "polar") {
      let connectionPath = Utilities.arcBetweenPoints(
        ...path[path.length - 1],
        this.max_r,
        0,
        12
      );
      connectionPath.push([this.max_r, 0]);
      connectionPath.shift();
      path = path.concat(connectionPath);
    }

    return path;
  }
}

export default SineWaves;