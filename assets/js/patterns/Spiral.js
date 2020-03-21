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
      "offset": {
        "name": "offset",
        "value": 4,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            40,
            4,
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
          "type": "createInput",
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
   * Setup the controls for the pattern.
   *
   * @return Null
   **/
  setup() {
    return null;
  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)
    this.config.sides.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.offset.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.twist.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.noise.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.sides.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.offset.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.twist.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.noise.value;

    // Calculate path
    let path = this.calc(
        0,
        0,
        0,
        0,
        this.config.offset.value,
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
  calc(start_x, start_y, start_r, start_theta, offset, sides, twist, noise) {

    // Set initial values
    var x;
    var y;
    var r = start_r;
    var theta = start_theta;

    // Calculate the maximum radius
    var max_r = Math.min(max_x/2, max_y/2);

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Continue as long as the design stays within bounds of the plotter
    // This isn't quite right yet. I need to look into the coordinate translations
    // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
    while (r < max_r) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = start_theta + (step/sides) * (2 * Math.PI);

      // Increment radius
      r = start_r + offset * (theta/(2 * Math.PI)) - (noise * Math.random());

      // Convert polar position to rectangular coordinates
      x = start_x + (r * Math.cos(theta * twist));
      y = start_y + (r * Math.sin(theta * twist));

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}