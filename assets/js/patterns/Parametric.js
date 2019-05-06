class Parametric {

  constructor() {

    this.key = "parametric";

    this.name = "Parametric";

    this.config = {
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
    // this.config.width.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    // this.config.height.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Calculate path for Circle at center
    let path = this.calc();

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc() {

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Heart Curve
    // http://mathworld.wolfram.com/HeartCurve.html
    const x_equation = "10 * (16 * pow(sin(theta), 3))";
    const y_equation = "10 * (13 * cos(theta) - 5 * cos(2 * theta) - 2 * cos(3 * theta) - cos(4 * theta))";

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the circle.
    let steps_per_revolution = 120;

    // Loop through one revolution
    while (theta < TWO_PI) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * TWO_PI;

      // Run the parametric equations
      x = eval(x_equation);
      y = eval(y_equation);

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}