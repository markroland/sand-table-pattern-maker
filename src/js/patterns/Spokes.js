/**
 * Spokes
 */
class Spokes {

  constructor(env) {

    this.key = "spokes";

    this.name = "Spokes";

    this.env = env;

    this.config = {
      "spokes": {
        "name": "Spokes",
        "value": null,
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
        "value": null,
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
        "value": null,
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
        "value": null,
        "input": {
          "type": "createCheckbox",
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

  draw() {

    // Update object
    this.config.spokes.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.waves.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.amplitude.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.spokes.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.waves.value.toFixed(1);
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.amplitude.value;

    // Calculate the path
    let path = this.calc(
      this.config.spokes.value,
      this.config.waves.value,
      this.config.amplitude.value
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

    const max_x = this.env.table.x.max;
    const max_y = this.env.table.y.max;

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
        y = direction * wave_amplitude * Math.sin((j/sub_steps) * num_waves * (2 * Math.PI));

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

export default Spokes;