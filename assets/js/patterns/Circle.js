class Circle {

  constructor() {

    this.key = "circle";

    this.name = "Circle";

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    this.config = {
      "radius": {
        "name": "Radius (r)",
        "value": max_r/2,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            0.5 * Math.min(max_x,max_y),
            max_r/2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "angle": {
        "name": "Start Angle (𝜃)",
        "value": 0,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            360,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
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
    this.config.radius.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.angle.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.angle.value + '°';

    // Calculate path for Circle at center
    //*
    let path = this.calc(
      0,
      0,
      this.config.radius.value,
      (this.config.angle.value / 360) * TWO_PI
    );
    //*/

    // Calculate path for Circle not at center
    /*
    var start_x = 0.25 * max_x;
    var start_y = 0.25 * max_y;
    let path = this.calc(
      start_x,
      start_y,
      this.config.radius,
      atan(start_y/start_x) + PI
    );
    //*/

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for a circle
   *
   * @param float start_x Starting X position (in G-code coordinates)
   * @param float start_y Starting Y position (in G-code coordinates)
   * @param float start_r Starting radius, where 0 is [x,y]
   * @param float start_theta Starting theta angle, between 0 and TWO_PI.
   *   0-degrees corresponds to the positive X direction and rotates counter clockwise
   *   (i.e. PI/2 is the positive y direction)
   * @param int rotation_direction Set 1 to move counterclockwise, -1 to move clockwise
   *
   *
   **/
  calc(start_x, start_y, radius, start_theta, rotation_direction = 1) {

    // Set initial values
    var x;
    var y;
    var theta = start_theta;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the circle.
    // A larger number makes the circle more smooth
    // let max_r = min((max_x - min_x), (max_y - min_y))/2;
    // let sides = 30 + (radius/max_r) * 30;
    let sides = 60;

    // Loop through one revolution
    while (theta < start_theta + TWO_PI) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = rotation_direction * (start_theta + (step/sides) * TWO_PI);

      // Convert polar position to rectangular coordinates
      x = start_x + (radius * cos(theta));
      y = start_y + (radius * sin(theta));

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}