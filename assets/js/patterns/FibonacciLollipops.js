/**
 * FibonacciLollipops
 */
class FibonacciLollipops {

  constructor() {

    this.key = "fibonaccilollipops";

    this.name = "Fibonacci Lollipops";

    this.config = {
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
  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Calculate path
    let path = this.calc();

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
  calc() {

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    var i = 0;
    var r_max = Math.min(max_x-min_x, max_y-min_y) / 2;
    var r = r_max;
    var theta = 0.0;
    var x, y, loop;

    var max_theta = 30 * (2 * Math.PI);
    var radius_shrink_factor = 0.007;
    var return_to_center = true;

    var x1, y1;

    var sub_path = new Array();

    var spiral_r, spiral_theta;
    var spiral_r_max = 30;
    var spiral_sides = 12;
    var spiral_revolutions = 3.5;

    while (r > 0 && theta < max_theta) {

      // Go back to center on even loops
      if (return_to_center) {
        if (i % 2 == 0) {
          i++;
          path.push([0.0, 0.0])
          continue;
        }
      }

      // Increment theta by golden ratio each iteration
      // https://en.wikipedia.org/wiki/Golden_angle
      if (return_to_center) {
        theta = (i-1)/2 * Math.PI * (3.0 - sqrt(5));
      } else {
        theta = i * Math.PI * (3.0 - sqrt(5));
      }

      // Set the radius of the Fibonacci "petal" (lollipop height)
      // Decrease the radius a bit each cycle
      r = (1 - radius_shrink_factor * i) * (0.5 * min(max_x, max_y) - 30);

      // Calc subpath for end of lollipop
      sub_path = [];

      // Spiral
      spiral_r_max = 0.99 * spiral_r_max;
      for (var k = 0; k <= spiral_revolutions * spiral_sides; k++) {
        spiral_theta = (k/spiral_sides) * (2 * Math.PI);
        spiral_r = spiral_r_max * (k/(spiral_revolutions * spiral_sides));
        x1 = spiral_r * cos(spiral_theta);
        y1 = spiral_r * sin(spiral_theta);
        sub_path.push([x1,y1]);
      }

      // Translate circle to end of lollipop
      // path = path.concat(this.translate_path(sub_path, 100, 0));
      sub_path = this.translate_path(sub_path, r, 0);

      path = path.concat(this.rotationMatrix(sub_path, theta));

      // increment loop counter
      i++;
    }

    return path;
  }

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
        a[0] * cos(theta) - a[1] * sin(theta),
        a[0] * sin(theta) + a[1] * cos(theta)
      ]
    });
  }

}