/**
 * Cycloid
 */
class Cycloid {

  constructor() {

    this.key = "cycloid";

    this.name = "Cycloid";

    this.config = {
      "radius_a": {
        "name": "Fixed Radius (A)",
        "value": Math.floor(0.5 * Math.min(max_x,max_y)),
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            Math.floor(0.5 * Math.min(max_x,max_y)),
            30,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "radius_b": {
        "name": "Fixed Radius (B)",
        "value": -1,
        "input": {
          "type": "createSlider",
          "params" : [
            -Math.floor(0.5 * Math.min(max_x,max_y)),
            -1,
            -Math.floor(0.25 * Math.min(max_x,max_y)),
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "arm_length": {
        "name": "Arm Length",
        "value": 100,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            0.5 * Math.min(max_x,max_y),
            Math.floor(0.25 * Math.min(max_x,max_y)),
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

    let controls = new Array();
    const configs = Object.entries(this.config);
    for (const [key, val] of configs) {

      // Create a new object
      var control = new Object();

      // Create the div that contains the control
      control.div = createDiv('<label>' + val.name + '</label>')
        .parent('pattern-controls')
        .addClass('pattern-control');

      // Create the control form input
      // TODO: make this dynamic
      if (val.input.type == "createSlider") {
        control.input = createSlider(val.input.params[0], val.input.params[1], val.input.params[2], val.input.params[3])
          .attribute('name', key)
          .parent(control.div)
          .addClass(val.input.class);
      } else if (val.input.type == "createInput") {
        control.input = createInput(val.input.params[0], val.input.params[1], val.input.params[2])
          .attribute("type", "checkbox")
          .attribute('name', key)
          .attribute('checkbox', null)
          .parent(control.div);
      }

      // Create a span element to display the current input's value (useful for Sliders)
      if (val.input.displayValue) {
        let radius_value = createSpan('0')
          .parent(control.div);
      }

      // Add to "controls" object
      controls.push(control);
    }
  }

  draw() {

    // Update object
    this.config.radius_a.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.radius_b.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.arm_length.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius_a.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.radius_b.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.arm_length.value;

    // Calculate the path
    let path = this.calc(
      parseInt(this.config.radius_a.value),
      parseInt(this.config.radius_b.value),
      parseInt(this.config.arm_length.value)
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for a Cycloid
   *
   * http://xahlee.info/SpecialPlaneCurves_dir/EpiHypocycloid_dir/epiHypocycloid.html
   **/
  calc(radius_a, radius_b, arm_length)
  {
    // Set initial values
    var x;
    var y;
    var theta = 0;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter
    var step = 0;

    // Set the step multiplication factor. A value of 1 will increase theta
    // by 1-degree. A value of 10 will result in theta increasing by
    // 10-degrees for each drawing loop. A larger number results in fewer
    // instructions (and a faster drawing), but at lower curve resolution.
    // A small number has the best resolution, but results in a large instruction
    // set and slower draw times. 10 seems to be a good balance.
    var step_scale = 10;

    // Calculate the period of the Cycloid
    // It is 2-Pi times the result of the rolling circle's radius divided by the
    // Greatest Common Divisor of the two circle radii.
    // https://www.reddit.com/r/math/comments/27nz3l/how_do_i_calculate_the_periodicity_of_a/
    var cycloid_period = abs(radius_b / this.greatest_common_divisor(parseInt(radius_a), parseInt(radius_b))) * (2 * Math.PI);

    // Continue as long as the design stays within bounds of the plotter
    while (theta < cycloid_period) {

      // Calculate theta offset for the step
      theta = radians(step_scale * step);

      // Cycloid parametric equations
      x = (radius_a + radius_b) * cos(theta) + arm_length * cos(((radius_a + radius_b)/radius_b) * theta);
      y = (radius_a + radius_b) * sin(theta) + arm_length * sin(((radius_a + radius_b)/radius_b) * theta);

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
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
}