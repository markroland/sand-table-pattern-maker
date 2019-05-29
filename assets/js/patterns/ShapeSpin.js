class ShapeSpin {

  constructor() {

    this.key = "shapespin";

    this.name = "Shape Spin";

    // Define the shape to spin

    // Square
    //*
    this.base_shape = [
        [30, 30],
        [60, 30],
        [60, 60],
        [30, 60]
    ];
    //*/

    // Ellipse
    /*
    var shape_sides = 32;
    this.base_shape = [];
    for (var j = 0; j <= (shape_sides+0); j++) {
      this.base_shape.push([
        0.3 * Math.min(max_x/2, max_y/2) + 0.7 * Math.min(max_x/2, max_y/2) * Math.cos((j/shape_sides) * 2 * Math.PI),
        0.3 * Math.min(max_x/2, max_y/2) * Math.sin((j/shape_sides) * 2 * Math.PI)
      ]);
    }
    //*/

    // Define the parametric equations using text inputs
    this.config = {};

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

    let path = this.calc(this.base_shape);

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(base_shape) {

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
    let steps_per_revolution = 60;

    let growth_factor;

    const max_t = TWO_PI;


    // Loop through one revolution
    while (t < max_t) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * TWO_PI;

      // Loop through base shape
      base_shape.forEach(function(element) {

        // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
        path.push(
          this.rotationMatrix(
            // this.translate(element[0], 100 - (2 * 20 * (t/max_t))),
            // this.translate(element[0], min(max_x/2, max_y/2) - 50),
            element[0],
            element[1],
            t
          )
        );
      }, this);

      // Increment iteration counter
      step++;
    }

    return path;
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(x, y, theta) {
      return [
        x * cos(theta) - y * sin(theta),
        x * sin(theta) + y * cos(theta)
      ];
  }

  /**
   * Translate points
   **/
  translate(pos, delta) {
    return pos + delta;
  }
}