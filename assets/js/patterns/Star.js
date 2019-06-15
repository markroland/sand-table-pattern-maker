/**
 * Star
 */
class Star {

  constructor() {

    this.key = "star";

    this.name = "Star";

    this.config = {
      "points": {
        "name": "Points",
        "value": 5,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            12,
            5,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "pointiness": {
        "name": "Pointiness",
        "value": 5,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            1,
            0.5,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "offset": {
        "name": "Offset",
        "value": 20,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            40,
            20,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "twist": {
        "name": "Twist",
        "value": 1.0,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            1.11,
            1,
            0.001
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
    this.config.points.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.pointiness.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.offset.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.twist.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.points.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.pointiness.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.offset.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.twist.value;

    // Calculate path
    let path = this.calc(
        0,
        0,
        0,
        0,
        this.config.offset.value,
        this.config.points.value,
        this.config.pointiness.value,
        this.config.twist.value
    );

    // Reverse the path
    if (document.querySelector('#pattern-controls > div:nth-child(5) > input[type=checkbox]').checked) {
      path.reverse();
    }

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
  calc(start_x, start_y, start_r, start_theta, offset, points, pointinesss, twist) {

    // Set initial values
    var x;
    var y;
    var r = start_r;
    var theta = start_theta;

    // Calculate the maximum radius
    var max_r = min(max_x/2, max_y/2);

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Continue as long as the design stays within bounds of the plotter
    // This isn't quite right yet. I need to look into the coordinate translations
    // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
    while (r < max_r) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = start_theta + (step/(points * 2)) * TWO_PI;

      // Increment radius
      r = (1 - ((step % 2) * pointinesss)) * (start_r + offset * (theta/TWO_PI));

      // Convert polar position to rectangular coordinates
      x = start_x + (r * cos(theta * twist));
      y = start_y + (r * sin(theta * twist));

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}