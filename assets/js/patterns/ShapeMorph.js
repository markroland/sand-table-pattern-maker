class ShapeMorph {

  constructor() {

    this.key = "shapemorph";

    this.name = "Shape Morph";

    // Define the shape to spin

    this.sides = 32;

    let radius = Math.min(max_x/2, max_y/2);

    // Construct array for Starting Shape (Square)
    // Middle right side to bottom right corner
    let i_max = this.sides/8;
    this.base_shape = [];
    for (var i = 0; i < i_max; i++) {
      this.base_shape.push([
        radius,
        -((i/i_max) * radius),
      ]);
    }
    // bottom right corner to bottom left corner
    i_max = this.sides/4;
    for (var i = 0; i < i_max; i++) {
      this.base_shape.push([
        radius - ((i/i_max) * (2 * radius)),
        -radius
      ]);
    }
    // bottom left corner to top left corner
    i_max = this.sides/4;
    for (var i = 0; i < i_max; i++) {
      this.base_shape.push([
        -radius,
        -radius + ((i/i_max) * (2 * radius)),
      ]);
    }
    // top left corner to top right corner
    i_max = this.sides/4;
    for (var i = 0; i < i_max; i++) {
      this.base_shape.push([
        -radius + ((i/i_max) * (2 * radius)),
        radius
      ]);
    }
    // top right corner to middle right side
    i_max = this.sides/8;
    for (var i = 0; i < i_max; i++) {
      this.base_shape.push([
        radius,
        radius - ((i/i_max) * radius),
      ]);
    }
    this.base_shape.push([radius,0]);

    // Ending Shape (Circle)
    var shape_sides = 32;
    this.end_shape = [];
    for (var j = 0; j <= (shape_sides+0); j++) {
      this.end_shape.push([
        radius * Math.cos((j/shape_sides) * 2 * Math.PI),
        -radius * Math.sin((j/shape_sides) * 2 * Math.PI)
      ]);
    }

    // Define the parametric equations using text inputs
    this.config = {
      "reverse": {
        "name": "Reverse",
        "value": 0,
        "input": {
          "type": "createInput",
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
    // this.config.steps.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;

    // Display selected values
    // document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.steps.value;

    let path = this.calc(
      this.base_shape,
      this.end_shape,
      this.sides
    );

    // Reverse the path
    if (document.querySelector('#pattern-controls > div:nth-child(1) > input[type=checkbox]').checked) {
      path.reverse();
    }

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(base_shape, end_shape, steps_per_revolution) {

    // Set initial values
    var x;
    var y;
    var t = 0.0;
    let revolutions = 20;
    let current_revolution;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    let growth_factor;

    const max_t = revolutions * TWO_PI;

    // Loop through revolutions
    while (t < max_t) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * TWO_PI;

      current_revolution = Math.floor(t/TWO_PI);

      // Debugging
      // if (current_revolution > 0) {
      //   return path;
      // }

      // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
      path.push(
        [
          (t/max_t) * lerp(base_shape[step % steps_per_revolution][0], end_shape[step % steps_per_revolution][0], current_revolution/revolutions),
          (t/max_t) * lerp(base_shape[step % steps_per_revolution][1], end_shape[step % steps_per_revolution][1], current_revolution/revolutions),
        ]

        // [
        //   (t/max_t) * base_shape[step % steps_per_revolution][0],
        //   (t/max_t) * base_shape[step % steps_per_revolution][1],
        // ]

        // [
        //   (t/max_t) * end_shape[step % steps_per_revolution][0],
        //   (t/max_t) * end_shape[step % steps_per_revolution][1],
        // ]
      );

      // Increment iteration counter
      step++;
    }

    return path;
  }
}