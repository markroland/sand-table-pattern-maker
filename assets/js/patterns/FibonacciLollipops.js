/**
 * FibonacciLollipops
 */
class FibonacciLollipops {

  constructor() {

    this.key = "fibonaccilollipops";

    this.name = "Fibonacci Lollipops";

    this.config = {
      "lollipopradius": {
        "name": "Lollipop Radius",
        "value": 30,
        "input": {
          "type": "createSlider",
          "params" : [
            10,
            60,
            30,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "lollipopturns": {
        "name": "Lollipop Turns",
        "value": 3.5,
        "input": {
          "type": "createSlider",
          "params" : [
            1.5,
            7.5,
            3.5,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "lollipopshrink": {
        "name": "Lollipop Shrink",
        "value": 3.5,
        "input": {
          "type": "createSlider",
          "params" : [
            0.001,
            0.020,
            0.007,
            0.001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rotations": {
        "name": "Rotations",
        "value": 30,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            100,
            30,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "spiral_factor": {
        "name": "Shrink Factor",
        "value": 30,
        "input": {
          "type": "createSlider",
          "params" : [
            0.001,
            0.010,
            0.007,
            0.001
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

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)
    this.config.lollipopradius.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.lollipopturns.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.lollipopshrink.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.rotations.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;
    this.config.spiral_factor.value = document.querySelector('#pattern-controls > div:nth-child(5) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.lollipopradius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.lollipopturns.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.lollipopshrink.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.rotations.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.spiral_factor.value;


    // Calculate path
    let path = this.calc(
      parseInt(this.config.lollipopradius.value),
      parseFloat(this.config.lollipopturns.value),
      parseFloat(this.config.lollipopshrink.value),
      parseInt(this.config.rotations.value),
      parseFloat(this.config.spiral_factor.value)
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
  calc(spiral_r_max, spiral_revolutions, lollipop_shrink, rotations, radius_shrink_factor) {

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    var i = 0;
    var r_max = Math.min(max_x-min_x, max_y-min_y) / 2;
    var r = r_max;
    var theta = 0.0;
    var x, y, loop;

    var max_theta = rotations * (2 * Math.PI);
    var return_to_center = true;

    var x1, y1;

    var sub_path = new Array();

    var spiral_r, spiral_theta;
    var spiral_sides = 24;

    // TODO: Refacator this so that it always ends in the center
    while (r > 0 && theta < max_theta) {

      // Increment theta by golden ratio each iteration
      // https://en.wikipedia.org/wiki/Golden_angle
      theta = i * Math.PI * (3.0 - sqrt(5));

      // Set the radius of the Fibonacci "petal" (lollipop height)
      // Decrease the radius a bit each cycle
      r = (1 - radius_shrink_factor * i) * (0.5 * Math.min(max_x, max_y) - spiral_r_max);

      // Lollipop Spiral
      sub_path = [];
      spiral_r_max = (1 - lollipop_shrink) * spiral_r_max;
      for (var k = 0; k <= spiral_revolutions * spiral_sides; k++) {
        spiral_theta = (k/spiral_sides) * (2 * Math.PI);
        spiral_r = spiral_r_max * (k/(spiral_revolutions * spiral_sides));
        x1 = spiral_r * cos(spiral_theta);
        y1 = spiral_r * sin(spiral_theta);
        sub_path.push([x1,y1]);
      }

      // Translate circle to end of lollipop
      // path = path.concat(this.translate_path(sub_path, 100, 0));
      sub_path = this.translate_path(sub_path, r, 0);

      path = path.concat(this.rotationMatrix(sub_path, theta));

      // Return to center;
      path.push([0.0, 0.0]);

      // increment loop counter
      i++;
    }

    return path;
  }

  /**
   * Translate a path
   **/
  translate_path(path, x_delta, y_delta) {
    return path.map(function(a){
      return [
        a[0] + x_delta,
        a[1] + y_delta
      ];
    });
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(path, theta) {
    return path.map(function(a){
      return [
        a[0] * cos(theta) - a[1] * sin(theta),
        a[0] * sin(theta) + a[1] * cos(theta)
      ]
    });
  }

}