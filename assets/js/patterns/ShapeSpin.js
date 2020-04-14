class ShapeSpin {

  constructor() {

    this.key = "shapespin";

    this.name = "Shape Spin";

    // Define the shape to spin

    // Shape 1
    //*
    this.base_shape = [
        [-160, 0],
        [80, -80],
        [160, 0],
        [80, 80],
        [-160, 0]
    ];
    //*/

    // Square
    /*
    this.base_shape = [
        [30, 30],
        [60, 30],
        [60, 60],
        [30, 60],
        [30, 30]
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
    this.config = {
      "steps": {
        "name": "Steps",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            120,
            30,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
    };

    this.path = [];
  }

  draw() {

    // Update object
    this.config.steps.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.steps.value;

    let path = this.calc(
      this.base_shape,
      parseInt(this.config.steps.value)
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
  calc(base_shape, steps_per_revolution) {

    // Set initial values
    var x;
    var y;
    var t = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    let growth_factor;

    const max_t = (2 * Math.PI);

    // Loop through one revolution
    while (t < max_t) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * (2 * Math.PI);

      // Loop through base shape
      base_shape.forEach(function(element) {

        // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
        path.push(
          this.rotationMatrix(
            // this.translate(element[0], 100 - (2 * 20 * (t/max_t))),
            // this.translate(element[0], Math.min(max_x/2, max_y/2) - 50),
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
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
  }

  /**
   * Translate points
   **/
  translate(pos, delta) {
    return pos + delta;
  }
}