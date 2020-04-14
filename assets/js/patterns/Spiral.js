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
        "value": null,
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
        "value": null,
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
      "start_r": {
        "name": "Start Radius",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            1.00,
            0,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "start_theta": {
        "name": "Start Theta",
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
      "twist": {
        "name": "Twist",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1,
            1,
            0,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "noise": {
        "name": "Noise",
        "value": null,
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
    this.config.sides.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.revolutions.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.start_r.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.start_theta.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;
    this.config.twist.value = document.querySelector('#pattern-controls > div:nth-child(5) > input').value;
    this.config.noise.value = document.querySelector('#pattern-controls > div:nth-child(6) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.sides.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.revolutions.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.start_r.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.start_theta.value + "°";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.twist.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(6) > span').innerHTML = this.config.noise.value;

    // Calculate path
    let path = this.calc(
      parseFloat(this.config.start_r.value),
      parseFloat(this.config.start_theta.value),
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
  calc(start_r, start_theta, revolutions, sides, twist, noise) {

    // Set initial values
    var x;
    var y;
    var r;
    var theta;
    var max_r = Math.min(max_x - min_x, max_y - min_y) / 2;
    var start_x = start_r * max_r * Math.cos(start_theta * (Math.PI/180));
    var start_y = start_r * max_r * Math.sin(start_theta * (Math.PI/180));

    // Initialize shape path array
    var path = new Array();

    // Loop through revolutions
    var i_max = sides * revolutions;
    var theta_max = (2 * Math.PI) * revolutions;
    var theta_twist;
    for (var i = 0; i <= i_max; i++) {

      // Rotational Angle
      theta_twist = ((i_max - i) / i_max) * twist * (2 * Math.PI);
      theta = (i/i_max) * theta_max - theta_twist;

      // Increment radius
      r = max_r * (i/i_max);

      // Add noise, except to the beginning and end points
      if (noise > 0 && i > 0 && i < i_max) {
        r -= noise * Math.random();
      }

      // Convert polar position to rectangular coordinates
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      // Move the focus point of the spiral
      x += (-start_x * (i/i_max)) + start_x;
      y += (-start_y * (i/i_max)) + start_y;

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }
}