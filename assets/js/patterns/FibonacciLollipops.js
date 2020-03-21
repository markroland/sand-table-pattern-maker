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
      "lollipopsides": {
        "name": "Lollipop Sides",
        "value": 6,
        "input": {
          "type": "createSlider",
          "params" : [
            3,
            12,
            6,
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
      "spiral_factor": {
        "name": "Shrink Factor",
        "value": -0.2,
        "input": {
          "type": "createSlider",
          "params" : [
            -0.020,
            -0.003,
            -0.010,
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
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)
    this.config.lollipopradius.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.lollipopsides.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.lollipopturns.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.spiral_factor.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.lollipopradius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.lollipopsides.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.lollipopturns.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.spiral_factor.value;


    // Calculate path
    let path = this.calc(
      parseInt(this.config.lollipopradius.value),
      parseInt(this.config.lollipopsides.value),
      parseFloat(this.config.lollipopturns.value),
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
  calc(spiral_r_max, spiral_sides, spiral_revolutions, radius_shrink_factor) {

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();
    var r_max = Math.min(max_x-min_x, max_y-min_y) / 2;
    var r;
    var theta;
    var x, y;

    // Calculate the number of iterations required to decay
    // to a minimum value;
    var r_min = ball_size / 2;
    var i_max = Math.log(r_min/r_max) / radius_shrink_factor;

    // "Lollipop" Spiral
    var sub_path = new Array();
    var x1, y1;
    var spiral_r, spiral_theta;

    // Loop through iterations
    for (var i = 0; i < i_max; i++) {

      // Increment theta by golden ratio each iteration
      // https://en.wikipedia.org/wiki/Golden_angle
      theta = i * Math.PI * (3.0 - Math.sqrt(5));

      // Set the radius of the Fibonacci "petal" (lollipop height)
      // Decrease the radius a bit each cycle
      r = (r_max - spiral_r_max) * Math.exp(radius_shrink_factor * i);

      // Lollipop Spiral
      sub_path = [];
      for (var k = 0; k <= spiral_revolutions * spiral_sides; k++) {
        spiral_theta = (k/spiral_sides) * (2 * Math.PI);
        spiral_r = (spiral_r_max * (1 - 0.5 * (i/i_max))) * (k/(spiral_revolutions * spiral_sides));
        x1 = spiral_r * Math.cos(spiral_theta);
        y1 = spiral_r * Math.sin(spiral_theta);
        sub_path.push([x1,y1]);
      }

      // Translate circle to end of lollipop
      sub_path = this.translate_path(sub_path, r, 0);

      path = path.concat(this.rotationMatrix(sub_path, theta));

      // Return to center;
      path.push([0.0, 0.0]);
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
        a[0] * Math.cos(theta) - a[1] * Math.sin(theta),
        a[0] * Math.sin(theta) + a[1] * Math.cos(theta)
      ]
    });
  }

}