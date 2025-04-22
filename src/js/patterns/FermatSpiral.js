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
        "value": null,
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
      },
      "return": {
        "name": "Return Home",
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
    this.config.revolutions.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.revolutions.value;

    // Return to home
    this.config.return.value = false;
    if (document.querySelector('#pattern-controls > div:nth-child(2) > input[type=checkbox]').checked) {
      this.config.return.value = true;
    }

    // Calculate path
    let path = this.calc(
      this.config.revolutions.value,
      this.config.return.value
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
  calc(revolutions, return_to_home) {

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
      x = a * Math.pow(t, pow_n) * Math.cos(t);
      y = a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    // Positive Radius
    for (var t = t_min; t <= t_max + t_step; t += t_step) {

      // Run the parametric equations
      x = -a * Math.pow(t, pow_n) * Math.cos(t);
      y = -a * Math.pow(t, pow_n) * Math.sin(t);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    if (return_to_home) {
      var i_max = 24;
      let r = Math.min(max_x - min_x, max_y - min_y) / 2;
      for (var i = 1; i <= i_max; i++) {
        path.push([
          r * Math.cos(i/i_max * Math.PI + Math.PI),
          r * Math.sin(i/i_max * Math.PI + Math.PI),
        ]);
      }
      path.push([r, 0]);
    }

    return path;
  }
}

export default FermatSpiral;