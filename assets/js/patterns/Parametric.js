/*
https://en.wikipedia.org/wiki/Parametric_equation
*/
class Parametric {

  constructor() {

    this.key = "parametric";

    this.name = "Parametric";

    // http://www.quantamagazine.org/how-to-create-art-with-mathematics-20151008
    // http://www.sineofthetimes.org/the-art-of-parametric-equations-2/
    let farris = {
      "x": "50 * cos(1*t) + 50 * cos(6*t)/2 + 50 * sin(14*t)/3",
      "y": "50 * cos(1*t) + 50 * sin(6*t)/2 + 50 * cos(14*t)/3"
    }

    // Rhodonea
    let rhodonea = {
        "x": "50 * sin(6*t) * cos(t)",
        "y": "50 * sin(6*t) * sin(t)"
    };

    // Butterfly Curve
    // https://en.wikipedia.org/wiki/Butterfly_curve_(transcendental)
    let butterfly = {
        "x": "40 * sin(t) * (pow(Math.E, cos(t)) - 2 * cos(4*t) - pow(sin(t/12), 5))",
        "y": "40 * cos(t) * (pow(Math.E, cos(t)) - 2 * cos(4*t) - pow(sin(t/12), 5))"
    };

    // Define the parametric equations using text inputs
    this.config = {
      "x": {
        "name": "X",
        "value": 0,
        "input": {
          "type": "createInput",
          "params" : [
            butterfly.x
          ]
        }
      },
      "y": {
        "name": "Y",
        "value": 0,
        "input": {
          "type": "createInput",
          "params" : [
            butterfly.y
          ]
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
          .attribute('name', key)
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
    this.config.x.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.y.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    let path = this.calc(
        this.config.x.value,
        this.config.y.value
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
  calc(x_equation, y_equation) {

    // Set initial values
    var x;
    var y;
    var t = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the circle.
    let steps_per_revolution = 120;

    // Loop through one revolution
    while (t < TWO_PI) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * TWO_PI;

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