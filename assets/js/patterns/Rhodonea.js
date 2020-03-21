/*
 * Rhodonea Curve
 * https://en.wikipedia.org/wiki/Rose_(mathematics)
*/
class Rhodonea {

  constructor() {

    this.key = "rhodonea";

    this.name = "Rhodonea (Rose) Curve";

    // this.path_sampling_optimization = 1;

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    // Define the parametric equations using text inputs
    this.config = {
      "amplitude": {
        "name": "Amplitude",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            max_r,
            max_r,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "petals": {
        "name": "Petal Value (k)",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            0.5,
            20,
            5,
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
    this.config.amplitude.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.petals.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.amplitude.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.petals.value;

    let path = this.calc(
        parseFloat(this.config.amplitude.value),
        parseFloat(this.config.petals.value)
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
  calc(amplitude, petals) {

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Set period of full rotation
    let period = 2 * Math.PI;

    // Set the steps per revolution. Oversample and small distances can be optimized out afterward
    let steps_per_revolution = 500;

    // Loop through one revolution
    while (theta < period) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * period;

      // Run the parametric equations
      x = amplitude * Math.sin(petals*theta) * Math.cos(theta);
      y = amplitude * Math.sin(petals*theta) * Math.sin(theta);

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}