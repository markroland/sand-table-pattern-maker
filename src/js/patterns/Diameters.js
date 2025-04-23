/**
 * Diameters
 */
class Diameters {

  constructor(env) {

    this.key = "diameters";

    this.name = "Diameters";

    this.env = env;

    this.config = {
      "spokes": {
        "name": "Spokes",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            60,
            12,
            2
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
            1,
            30,
            4,
            1
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
            20,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

    this.path = [];
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
      parseInt(this.config.waves.value),
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

    const max_x = this.env.table.x.max;
    const max_y = this.env.table.y.max;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Change in theta per step
    var theta_per_step = (2*Math.PI) / num_spokes;

    // Sub-steps
    var sub_steps = 20 * num_waves;

    // Set direction of travel for "x"
    var direction = 1;

    // Loop through 360 degrees
    while (theta < (2*Math.PI)) {

      // Calculate new theta
      theta = step * theta_per_step;

      for (var j = 0; j <= sub_steps; j++) {

        // Sine Wave
        x = direction * (Math.min(max_x, max_y)/2) * ((j - (sub_steps/2))/(sub_steps/2));
        y = wave_amplitude * Math.sin((j/sub_steps) * num_waves * (2*Math.PI));

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

export default Diameters;