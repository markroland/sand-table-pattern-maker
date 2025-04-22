/**
 * Logarithmic Spiral
 * https://en.wikipedia.org/wiki/Logarithmic_spiral
 * https://mathworld.wolfram.com/LogarithmicSpiral.html
 */
class LogarithmicSpiral {

  constructor(env) {

    this.key = "logspiral";

    this.name = "Spiral (Logarithmic)";

    this.env = env;

    this.config = {
      "a": {
        "name": "a",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1.0,
            1.0,
            1.0,
            0.1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "b": {
        "name": "b",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1.0,
            0.0,
            -0.25,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "revolutions": {
        "name": "Revolutions",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            60,
            4,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rotate": {
        "name": "Rotate",
        "value": null,
        "input": {
          "type": "createSlider",
          "params": [
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


  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)
    this.config.a.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.b.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.revolutions.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.rotate.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.a.value.toFixed(2) + " * r<sub>max</sub>";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.b.value.toFixed(2);
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.revolutions.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.rotate.value + "°";

    // Calculate path
    let path = this.calc(
      this.config.a.value,
      this.config.b.value,
      this.config.revolutions.value,
      60
    );

    // Update object
    this.path = path;

    // Rotate path around the center of drawing area
    if (this.config.rotate.value > 0) {
      path = this.rotate_around_center(path);
    }

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(a, b, revolutions, sides) {

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Calculate the maximum radius
    var max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Set max rotations. Go over by 1 "side" so that endpoint completes a full rotation
    let theta_max = (revolutions + 1/sides) * (2 * Math.PI);

    // Set the change per increment
    let delta_theta = (2 * Math.PI) / sides;

    // Loop through each angle segment
    for (var theta = 0; theta < theta_max; theta += delta_theta) {

      // Convert polar position to rectangular coordinates
      x = max_r * a * Math.exp(b * theta) * Math.cos(theta);
      y = max_r * a * Math.exp(b * theta) * Math.sin(theta);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }

  rotate_around_center(path) {
    var theta = this.config.rotate.value * (Math.PI/180);
    return path.map(function(a){
      var x = a[0];
      var y = a[1];
      return [
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
    });
  }
}

export default LogarithmicSpiral;