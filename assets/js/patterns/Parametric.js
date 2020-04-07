/*
https://en.wikipedia.org/wiki/Parametric_equation
*/
class Parametric {

  constructor() {

    this.key = "parametric";

    this.name = "Parametric";

    // Butterfly Curve
    // https://en.wikipedia.org/wiki/Butterfly_curve_(transcendental)
    let butterfly = {
        "x": "40 * Math.sin(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))",
        "y": "40 * Math.cos(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))"
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
    while (t < (2 * Math.PI)) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * (2 * Math.PI);

      // Run the parametric equations
      x = eval(x_equation);
      y = eval(y_equation);

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    return path;
  }
}