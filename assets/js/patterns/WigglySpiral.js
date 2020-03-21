/**
 * Wiggly Spiral
 */
class WigglySpiral {

  constructor() {

    this.key = "wigglyspiral";

    this.name = "Wiggly Spiral";

    this.config = {
      "offset": {
        "name": "Offset",
        "value": 20,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            40,
            20,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "amplitude": {
        "name": "Amplitude",
        "value": 5,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            10,
            5,
            0.1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "wiggles": {
        "name": "Wiggles/Rev",
        "value": 20,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            40,
            20,
            0.1
          ],
          "class": "slider",
          "displayValue": true
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
    this.config.offset.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.amplitude.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.wiggles.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.offset.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.amplitude.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.wiggles.value;

    // Calculate path
    let path = this.calc(
        0,
        0,
        0.9 * (max_y/2),
        0,
        this.config.offset.value,
        this.config.amplitude.value,
        this.config.wiggles.value
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
  calc(start_x, start_y, start_r, start_theta, distance_between_turns, wiggle_amplitude, wiggle_frequency) {

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

    // Increase the denominator to get finer resolution (more instructions/longer time to plot)
    var theta_per_step = 1/300;

    // Continue as long as the design stays within bounds of the plotter
    // This isn't quite right yet. I need to look into the coordinate translations
    // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
    while (r > 0) {
    // while (theta < 100 * (2 * Math.PI)) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = step * theta_per_step * (2 * Math.PI);

      // Decrement the radius by a set amount per rotation
      // Every full rotation the radius is reduced by the offset (distance_between_turns)
      r = start_r - distance_between_turns * (step * theta_per_step);

      // Optional: Decay Frequency and Amplitude
      // wiggle_frequency = 0.9999 * wiggle_frequency;
      // wiggle_amplitude = 0.99999 * wiggle_amplitude;

      // Add a wiggle with a constant amplitude
      // Subtract from radius so that drawing area will not be exceeded
      r = r - wiggle_amplitude * Math.sin(wiggle_frequency * theta);

      // Convert polar position to rectangular coordinates
      x = start_x + (r * Math.cos(theta));
      y = start_y + (r * Math.sin(theta));

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}