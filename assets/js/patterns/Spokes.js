/**
 * Spokes
 */
class Spokes {

  constructor() {

    this.key = "spokes";

    this.name = "Spokes";

    this.config = {
      "spokes": {
        "name": "Spokes",
        "value": 60,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            120,
            60,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "waves": {
        "name": "Waves",
        "value": 4,
        "input": {
          "type": "createSlider",
          "params" : [
            0.5,
            10,
            4,
            0.5
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "amplitude": {
        "name": "Amplitude",
        "value": 10,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            60,
            10,
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
    this.config.spokes.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.waves.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.amplitude.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.spokes.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.waves.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.amplitude.value;

    // Calculate the path
    let path = this.calc(
      parseInt(this.config.spokes.value),
      parseFloat(this.config.waves.value),
      parseInt(this.config.amplitude.value)
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Diameters that cross the circle
   **/
  calc(num_spokes, num_waves, wave_amplitude)
  {

    // Set initial values
    var x;
    var y;
    var theta = 0;

    // Calculate the maximum radius
    var max_r = Math.min(max_x/2, max_y/2);

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Change in theta per step
    var theta_per_step = (2 * Math.PI) / num_spokes;

    // Sub-steps
    var sub_steps = 20 * num_waves;

    // Set direction of travel for "x"
    var direction = 1;

    // Loop through 360 degrees
    while (theta < (2 * Math.PI)) {

      // Calculate new theta
      theta = step * theta_per_step;

      for (var j = 0; j <= sub_steps; j++) {

        // Sine Wave
        if (direction > 0) {
          x = direction * (Math.min(max_x, max_y)/2) * (j/sub_steps);
        } else {
          x = -direction * (Math.min(max_x, max_y)/2) * ((sub_steps - j)/sub_steps);
        }
        y = direction * wave_amplitude * sin((j/sub_steps) * num_waves * (2 * Math.PI));

        // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
        path.push(
          this.rotationMatrix(x, y, theta)
        );
      }

      // Increment iteration counter
      step++;

      // Alternate the direction each step, going from +x to -x
      direction = direction * -1;
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
}