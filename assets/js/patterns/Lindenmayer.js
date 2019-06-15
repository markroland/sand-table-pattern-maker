/**
 * Lindenmayer
 *
 * Modified from https://p5js.org/examples/simulate-l-systems.html on 6/15/2019
 *
 */
class Lindenmayer {

  constructor() {

    this.key = "lindenmayer";

    this.name = "Lindenmayer";

    // Hilbert Curve
    // https://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system
    /*
    this.curve = {
      "l_system" : {
        "axiom": "A",
        "rules" : [
          ["A", "-BF+AFA+FB-"],
          ["B", "+AF-BFB-FA+"]
        ]
      },
      "draw" : {
        "length": ball_size,
        "angle": 90
      }
    }

    this.config = {
      "iterations": {
        "name": "Iterations",
        "value": 3,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            7,
            4,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "length": {
        "name": "Line Length",
        "value": 10,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            50,
            10,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
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
    this.config.iterations.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.curve.iterations = this.config.iterations.value;
    this.config.length.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.iterations.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.length.value + " " + units;

    let lindenmayer_string = this.curve.l_system.axiom;
    for (let i = 0; i < this.curve.iterations; i++) {
      lindenmayer_string = this.compose_lindenmayer_string(lindenmayer_string);
    }

    // Log Lindemayer System string
    // console.log(lindenmayer_string);

    // Calculate path
    let path = this.calc(lindenmayer_string, this.config.length.value);

    // Log Path coordinates
    // console.log(path);

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
  calc(lindenmayer_string, segment_length) {

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    var pos = 0;

    let x = 0;
    let y = 0;

    var current_angle = 0;

    while (pos < lindenmayer_string.length-1) {

      if (lindenmayer_string[pos] == 'F') {

        // Draw forward

        // polar to cartesian based on step and current_angle:
        let x1 = x + segment_length * cos(radians(current_angle));
        let y1 = y + segment_length * sin(radians(current_angle));

        path.push([x1, y1]);

        // update the turtle's position:
        x = x1;
        y = y1;

      } else if (lindenmayer_string[pos] == '+') {

        // Turn left
        current_angle += this.curve.draw.angle;

      } else if (lindenmayer_string[pos] == '-') {

        // Turn right
        current_angle -= this.curve.draw.angle;
      }

      pos++;
    }

    // console.log(path);

    // Define function to extract column from multidimensional array
    const arrayColumn = (arr, n) => arr.map(a => a[n]);

    // Transpose path to center of drawing area

    // Get X and Y coordinates as an 1-dimensional array
    var x_coordinates = arrayColumn(path, 0);
    var x_min = Math.min(...x_coordinates);
    var x_max = Math.max(...x_coordinates);
    var x_range = x_max - x_min;

    var y_coordinates = arrayColumn(path, 1);
    var y_min = Math.min(...y_coordinates);
    var y_max = Math.max(...y_coordinates);
    var y_range = y_max - y_min;

    // Translate path to center of drawing area
    path = path.map(function(a){
      return [
        (a[0] - x_min - ((x_max - x_min)/2)),
        (a[1] - y_min - ((y_max - y_min)/2)),
      ];
    });

    return path;
  }

  compose_lindenmayer_string(s) {

    // Start a blank output string
    let outputstring = '';

    // Iterate through the Lindenmayer rules looking for symbol matches
    for (let i = 0; i < s.length; i++) {

      let ismatch = 0;

      for (let j = 0; j < this.curve.l_system.rules.length; j++) {

        if (s[i] == this.curve.l_system.rules[j][0]) {

          // Write substitution
          outputstring += this.curve.l_system.rules[j][1];

          // We have a match, so don't copy over symbol
          ismatch = 1;

          break;
        }
      }

      // If nothing matches, just copy the symbol over.
      if (ismatch == 0) {
        outputstring+= s[i];
      }
    }

    return outputstring;
  }
}