/**
 * Fibonacci
 */
class Fibonacci {

  constructor() {

    this.key = "fibonacci";

    this.name = "Fibonacci";

    this.config = {
      "decay": {
        "name": "Decay Factor",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -0.020,
            -0.001,
            -0.004,
            0.0001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rtc": {
        "name": "Return to Center",
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
    this.config.decay.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.rtc.value = false;
    if (document.querySelector('#pattern-controls > div:nth-child(2) > input[type=checkbox]').checked) {
      this.config.rtc.value = true;
    }

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.decay.value.toFixed(4);

    // Calculate the path
    let path = this.calc(
      this.config.decay.value,
      this.config.rtc.value
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
  calc(radius_shrink_factor, return_to_center)
  {
    var path = new Array();
    var r_max = Math.min(max_x - min_x, max_y - min_y) / 2;
    var r;
    var theta;
    var x, y;

    // Calculate the number of iterations required to decay
    // to a minimum value;
    var r_min = ball_size / 2;
    var i_max = Math.log(r_min/r_max) / radius_shrink_factor;

    // Loop through iterations
    for (var i = 0; i < i_max; i++) {

      // Increment theta by golden ratio each iteration
      // https://en.wikipedia.org/wiki/Golden_angle
      theta = i * Math.PI * (3.0 - Math.sqrt(5));

      // Set the radius
      r = r_max * Math.exp(radius_shrink_factor * i)

      // Convert to cartesian
      x = r * Math.cos(theta);
      y = r * Math.sin(theta);

      // Add point to path
      path.push([x,y]);

      // Go back to center
      if (return_to_center) {
        path.push([0,0]);
      }
    }

    // End in center
    if (!return_to_center) {
      path.push([0,0]);
    }

    return path;
  }
}