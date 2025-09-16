import PathHelper from '@markroland/path-helper'

/**
 * Fibonacci
 */
class Fibonacci {

  constructor(env) {

    this.key = "fibonacci";

    this.name = "Fibonacci";

    this.env = env;

    this.config = {
      "decay": {
        "name": "Decay Factor",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -0.020,
            -0.001,
            -0.004,
            0.0001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "transition": {
        "name": "Transition",
        "value": null,
        "input": {
          "type": "createSelect",
          "options": {
            "direct": "Direct",
            "center": "Center",
            "bezier": "Bezier Curve"
          }
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
    this.config.decay.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.transition.value = document.querySelector('#pattern-controls > div:nth-child(2) > select').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.decay.value.toFixed(4);

    // Calculate the path
    let path = this.calc(
      this.config.decay.value,
      this.config.transition.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /*
  * Draw Fibonacci Spiral Spokes
  *
  * Type: Radial
  **/
  calc(radius_shrink_factor, transition)
  {

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;
    const ball_size = this.env.ball.diameter;

    var path = new Array();
    var r_max = Math.min(max_x - min_x, max_y - min_y) / 2;
    var r;
    var theta;
    var x, y;

    // Calculate the number of iterations required to decay
    // to a minimum value;
    var r_min = ball_size / 2;
    var i_max = Math.log(r_min/r_max) / radius_shrink_factor;

    // Loop through iterations
    for (var i = 0; i < i_max; i++) {

      // Increment theta by golden ratio each iteration
      // https://en.wikipedia.org/wiki/Golden_angle
      theta = i * Math.PI * (3.0 - Math.sqrt(5));

      // Set the radius
      r = r_max * Math.exp(radius_shrink_factor * i)

      // Convert to cartesian
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      if (transition == "bezier") {
        if (path.length) {
          path = path.concat(
            this.transition(
              path[path.length - 1],
              [x,y],
            )
          )
        }
      } else if (transition == "center") {
        path.push([0,0]);
      }

      // Add new point to path
      path.push([x,y]);
    }

    // Always end in center
    path.push([0,0]);

    return path;
  }

  transition(p1, p2) {

    const option = 2;

    let transitionPath = [];

    const PathHelp = new PathHelper();

    if (option == 1) {

      const midpoint = PathHelp.midpoint(p1, p2);

      const theta = Math.atan2(midpoint[1], midpoint[0]);
      const r = Math.sqrt(midpoint[0] ** 2 + midpoint[1] ** 2);
      const r_factor = 0.5;

      const point = [
        r_factor * r * Math.cos(theta),
        r_factor * r * Math.sin(theta)
      ];

      transitionPath.push(point);

    } else if (option == 2) {

      let bezier = PathHelp.quadraticBezierPath(p1, [0, 0], p2, 10);

      bezier = bezier.slice(1, -1);
      transitionPath = bezier;

    }

    return transitionPath;
  }
}

export default Fibonacci;