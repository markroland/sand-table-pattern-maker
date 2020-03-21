/**
 * Fermat's Spiral
 *
 * https://en.wikipedia.org/wiki/Fermat%27s_spiral
 */
class FermatSpiral {

  constructor() {

    this.key = "fermatspiral";

    this.name = "Fermat's Spiral";

    this.config = {
      "revolutions": {
        "name": "Revolutions",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            10,
            3,
            1
          ],
          "class": "slider",
          "displayValue": true
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
    this.config.revolutions.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.revolutions.value;

    // Calculate path
    let path = this.calc(
      parseInt(this.config.revolutions.value)
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
  calc(revolutions) {

    /*
        Recommended settings:

        revolutions: 3
        a: 10
        pow_n: 1.0

    */

    // Set initial values
    var x;
    var y;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Controls "tightness" of spiral. 1.0 is a good value
    const pow_n = 1.0;

    // Radius of spiral
    let a = 30 / revolutions;

    // The number of "sides" to the circle.
    const steps_per_revolution = 60;

    // Loop through one revolution
    const t_min = revolutions * 0;
    const t_max = revolutions * (2 * Math.PI);
    const t_step = (t_max - t_min) / (revolutions * steps_per_revolution);

    // Negative Radius
    for (var t = t_max; t >= t_min; t -= t_step) {

      // Run the parametric equations
      x = -a * Math.pow(t, pow_n) * Math.cos(t);
      y = -a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    // Positive Radius
    for (var t = t_min; t <= t_max + t_step; t += t_step) {

      // Run the parametric equations
      x = a * Math.pow(t, pow_n) * Math.cos(t);
      y = a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }
}