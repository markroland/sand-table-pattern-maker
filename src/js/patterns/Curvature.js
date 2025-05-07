import PathHelper from '@markroland/path-helper'

class Curvature {

  constructor(env) {
    this.key = "curvature";
    this.name = "Curvature";
    this.env = env;

    this.config = {
      "radius": {
        "name": "Start Radius",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            1,
            0.05,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "iterations": {
        "name": "Iterations",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            100,
            40,
            2
          ],
          "class": "slider",
          "displayValue": true
        }
      },
    };

    this.path = [];
  }

  draw() {

    const PathHelp = new PathHelper();

    // Update object
    this.config.radius.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.iterations.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.iterations.value;

    let path = [];

    // Set maximum radius based on table size
    const max_r = 0.5 * Math.min(
      (this.env.table.x.max - this.env.table.x.min),
      (this.env.table.y.max - this.env.table.y.min)
    );

    // Crop Circle
    const cropShape = PathHelp.polygon(60, max_r);

    // This needs to be even to mirror properly
    const i_max = this.config.iterations.value;

    // const starting_radius = this.config.radius.value * max_r;
    const starting_radius = this.config.radius.value * max_r;
    const ending_radius = 40.0 * max_r;
    for (let i = 0; i < i_max; i++) {

      // The radius should increase. It can be eased using different methods
      const radius = starting_radius + this.#easeInQuart(i/i_max) * (ending_radius - starting_radius);

      // The y position should start out near the top and the bottom of the circle/arc
      // should step down by one increment of (i) as a fraction of the maximum radius,
      // ensuring equal spacing between each arc
      const y = max_r + 1.0 * radius - (max_r * (i / i_max));

      const sides = Math.round((2 * Math.PI * radius) / (0.5 * this.env.ball.diameter));
      let arc = PathHelp.arc(
        [0, 0],
        radius,
        2 * Math.PI,
        0.5 * Math.PI,
        sides
      );

      if (i % 2) {
        arc.reverse();
      }

      arc = PathHelp.translatePath(arc, [0, y]);

      let cropped = PathHelp.cropToShape([arc], cropShape);

      if (cropped.length) {
        path = path.concat(cropped[0]);
      }
    }

    const horizontal_line = [
      [-max_r, 0],
      [0, 0]
    ];
    if (path[path.length - 1][0] > 0) {
      horizontal_line.reverse();
    }
    path = path.concat(horizontal_line);

    // Duplicate and flip
    let flip = PathHelp.deepCopy(path);
    flip.reverse();
    flip = PathHelp.rotatePath(flip, Math.PI);
    flip.shift();
    path = path.concat(flip);

    // Define arc from home position to start of path
    const arc_from_home = PathHelp.arc(
      [0, 0],
      max_r,
      0.5 * Math.PI,
      0,
      12
    );

    // Define arc from end of path to home position
    const arc_to_home = PathHelp.arc(
      [0, 0],
      max_r,
      0.5 * Math.PI,
      1.5 * Math.PI,
      12
    );

    // Redefine path with start/ending paths
    path = arc_from_home.concat(path, arc_to_home);

    // path = PathHelp.simplify(path, 0.5 * this.env.ball.diameter);

    // Simplify decimal precision
    path = path.map(function(point) {
      return point.map(function(number) {
        return parseFloat(number.toFixed(2));
      });
    });

    return path;
  }

  #easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  #easeInQuart(x) {
    return x * x * x * x;
  }

  #easeInCubic(x) {
    return x * x * x;
  }

  #easeInQuad(x) {
    return x * x;
  }

  #easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  }

  #easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }
}

export default Curvature;