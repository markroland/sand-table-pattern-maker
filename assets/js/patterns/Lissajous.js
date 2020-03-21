/*
 * Lissajous Curve
 * https://en.wikipedia.org/wiki/Lissajous_curve
*/
class Lissajous {

  constructor() {

    this.key = "lissajous";

    this.name = "Lissajous Curve";

    this.path_sampling_optimization = 2;

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    // Define the parametric equations using text inputs
    this.config = {
      "A": {
        "name": "X Amplitude",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            max_r,
            max_r/2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "a1": {
        "name": "X Frequency (a)",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            100,
            8,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "B": {
        "name": "Y Amplitude",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            max_r,
            max_r/2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "b1": {
        "name": "Y Frequency (b)",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            100,
            9,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "phase": {
        "name": "Phase Offset",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            -Math.PI,
            Math.PI,
            0,
            Math.PI / 32
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rotation": {
        "name": "Rotation",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            -180,
            180,
            0,
            1
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
    this.config.A.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.a1.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.B.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.b1.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;
    this.config.phase.value = document.querySelector('#pattern-controls > div:nth-child(5) > input').value;
    this.config.rotation.value = document.querySelector('#pattern-controls > div:nth-child(6) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.A.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.a1.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.B.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.b1.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = Math.round(parseFloat(this.config.phase.value) * (180/Math.PI), 2) + "°";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(6) > span').innerHTML = this.config.rotation.value + "°";

    let path = this.calc(
        parseFloat(this.config.A.value),
        parseFloat(this.config.a1.value),
        parseFloat(this.config.B.value),
        parseFloat(this.config.b1.value),
        parseFloat(this.config.phase.value),
        parseFloat(this.config.rotation.value)
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(A, a1, B, b1, phase, rotation) {

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Calculate the full period of the Lissajous curve
    // https://stackoverflow.com/questions/9620324/how-to-calculate-the-period-of-a-lissajous-curve
    let lissajous_period = 2 * Math.PI / this.greatest_common_divisor(a1, b1);

    // Set the steps per revolution. Oversample and small distances can be optimized out afterward
    let steps_per_revolution = 5000;

    // Loop through one revolution
    while (theta < lissajous_period) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * lissajous_period;

      // Run the parametric equations
      x = A * Math.cos(a1*theta + phase);
      y = B * Math.cos(b1*theta);

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    // Rotate
    if (rotation != 0) {
        path = path.map(function(element) {
            return this.rotationMatrix(element[0], element[1], rotation * (Math.PI/180))
        }, this);
    }

    return path;
  }

  /**
   * Calculate the Greatest Common Divisor (or Highest Common Factor) of 2 numbers
   *
   * https://en.wikipedia.org/wiki/Greatest_common_divisor
   * https://www.geeksforgeeks.org/c-program-find-gcd-hcf-two-numbers/
   */
   greatest_common_divisor(a, b) {
    if (b == 0) {
      return a;
    }
    return this.greatest_common_divisor(b, a % b);
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(x, y, theta) {
      return [
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
  }
}