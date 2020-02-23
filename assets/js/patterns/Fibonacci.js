/**
 * Fibonacci
 */
class Fibonacci {

  constructor() {

    this.key = "fibonacci";

    this.name = "Fibonacci";

    this.config = {
      "turns": {
        "name": "Turns",
        "value": 100,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            300,
            100,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "shrink": {
        "name": "Shrink",
        "value": 100,
        "input": {
          "type": "createSlider",
          "params" : [
            0.001,
            0.010,
            0.001,
            0.0001
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

  draw() {

    // Update object
    this.config.turns.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.shrink.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.turns.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.shrink.value;

    // Calculate the path
    let path = this.calc(
      this.config.turns.value * TWO_PI,
      this.config.shrink.value,
      false
    );

    // Update object
    this.path = path;

    return path;
  }

    /*
    * Draw Fibonacci Spiral Spokes
    *
    * Type: Radial
    **/
    calc(max_theta, radius_shrink_factor, return_to_center)
    {
      var path = new Array();
      var i = 0;
      var r = min(max_x/2, max_y/2);
      var theta = 0.0;
      var x, y, loop;
      while (r > 0 && theta < max_theta) {

        loop = i;

        // Go back to center on even loops
        if (return_to_center) {

          // Cut the loop count in half since half of the time
          // the coordinates are return to the center
          loop = i/2;

          if (i % 2 == 0) {
            x = 0.0;
            y = 0.0;
            continue;  // ?
          }
        }

        // Increment theta by golden ratio each iteration
        // https://en.wikipedia.org/wiki/Golden_angle
        theta = loop * PI * (3.0 - sqrt(5));

        // Set the radius
        // Decrease the radius a bit each cycle
        r = (1 - radius_shrink_factor * i) * (0.5 * min(max_x, max_y));

        // Convert to cartesian
        x = r * cos(theta);
        y = r * sin(theta);

        path[i] = [x,y];

        i++;
      }

      return path;
    }
}