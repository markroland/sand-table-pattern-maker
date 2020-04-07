/**
 * Spiral
 */
class Spiral {

  constructor() {

    this.key = "spiral";

    this.name = "Spiral";

    this.config = {
      "sides": {
        "name": "Sides",
        "value": 12,
        "input": {
          "type": "createSlider",
          "params" : [
            3,
            60,
            12,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "revolutions": {
        "name": "Revolutions",
        "value": 4,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            60,
            20,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "twist": {
        "name": "Twist",
        "value": 1.0005,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            1.11,
            1.005,
            0.001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "noise": {
        "name": "Noise",
        "value": 0,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            50,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "reverse": {
        "name": "Reverse",
        "value": 0,
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
    this.config.sides.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.revolutions.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.twist.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.noise.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.sides.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.revolutions.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.twist.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.noise.value;

    // Calculate path
    let path = this.calc(
        0,
        0,
        0,
        0,
        this.config.revolutions.value,
        this.config.sides.value,
        this.config.twist.value,
        this.config.noise.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(start_x, start_y, start_r, start_theta, revolutions, sides, twist, noise) {

    // Set initial values
    var x;
    var y;
    var r = start_r;
    var theta = start_theta;

    // Initialize shape path array
    var path = new Array();

    // Maximum radius
    var max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

    // Loop through revolutions
    var i_max = sides * revolutions;
    for (var i = 0; i <= i_max; i++) {

      // Rotational Angle
      theta = start_theta + (i/sides) * (2 * Math.PI);

      // Increment radius
      r = start_r + (max_r * (i/(i_max)) - (noise * Math.random()));

      // Convert polar position to rectangular coordinates
      x = start_x + (r * Math.cos(theta));
      y = start_y + (r * Math.sin(theta));

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }
}