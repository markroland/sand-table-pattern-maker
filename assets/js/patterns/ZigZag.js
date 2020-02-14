/**
 * Zig Zag
 */
class ZigZag {

  constructor() {

    this.key = "zigzag";

    this.name = "ZigZag";

    this.config = {
      "spacing": {
        "name": "Spacing",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            -((max_y - min_y) / 2),
            -1,
            -0.5 * ((max_y - min_y) / 2),
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "margin": {
        "name": "Margin",
        "value": 0,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            Math.min(max_x-min_x, max_y-min_y)/10,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "border": {
        "name": "Border",
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
    this.config.spacing.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.margin.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.border.value = 0
    if (document.querySelector('#pattern-controls > div:nth-child(3) > input[type=checkbox]').checked) {
      this.config.border.value = 1
    }

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = nfc((max_y - min_y)/(-this.config.spacing.value), 1) + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.margin.value + " mm";

    // Calculate path
    let path = this.calc(
        (max_y - min_y) / (-this.config.spacing.value),
        parseInt(this.config.margin.value),
        0.0,
        this.config.border.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param float Spacing
   * @param float Margin
   * @param float Angle
   * @param integer Border
   *
   * @return Array Path
   **/
  calc(spacing, margin, angle, border) {

    // Set initial values
    var start_x = -((max_x/2) - margin);
    var start_y = -((max_y/2) - margin);
    var x = start_x;
    var y = start_y;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Continue as long as the design stays within bounds of the plotter
    while ((y + spacing) <= ((max_y/2) - margin)) {

      if (step % 4 == 0) {
        // Move Right
        x = (max_x - min_x)/2 - margin;
      } else if (step % 4 == 2) {
        // Move Left
        x = -(max_x - min_x)/2 + margin;
      } else {
        // Move Up
        y = y + spacing;
      }

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    if (border) {

      // Ends on left (min) side
      if (x < 0) {
        path.push([(max_x/2 - margin), y]);
        path.push([(max_x/2 - margin), start_y]);
        path.push([x, start_y]);
        path.push([x, y]);
      } else {
        path.push([+((max_x-min_x)/2 - margin), start_y]);
        path.push([-((max_x-min_x)/2 - margin), start_y]);
        path.push([-((max_x-min_x)/2 - margin), y]);
        path.push([x, y]);
      }

    }

    return path;
  }
}