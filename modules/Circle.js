exports.path = function () {
  var circle = new Circle;
  return circle.calc(0,0,100,0);
};

// Note: This is basically a copy of assets/js/patterns/Circle.js
// I'm just doing this to test out a Node CLI. Ultimately these
// two options would pull from the same core logic.
class Circle {

  constructor() {

  }

  /**
   * Calculate coordinates for a circle
   *
   * @param float start_x Starting X position (in G-code coordinates)
   * @param float start_y Starting Y position (in G-code coordinates)
   * @param float start_r Starting radius, where 0 is [x,y]
   * @param float start_theta Starting theta angle, between 0 and (2 * Math.PI).
   *   0-degrees corresponds to the positive X direction and rotates counter clockwise
   *   (i.e. PI/2 is the positive y direction)
   * @param int rotation_direction Set 1 to move counterclockwise, -1 to move clockwise
   *
   *
   **/
  calc(start_x, start_y, radius, start_theta, rotation_direction = 1) {

    // Set initial values
    var x;
    var y;
    var theta = start_theta;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the circle.
    // A larger number makes the circle more smooth
    // let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;
    // let sides = 30 + (radius/max_r) * 30;
    let sides = 60;

    // Loop through one revolution
    while (theta < start_theta + (2 * Math.PI)) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = rotation_direction * (start_theta + (step/sides) * (2 * Math.PI));

      // Convert polar position to rectangular coordinates
      x = start_x + (radius * Math.cos(theta));
      y = start_y + (radius * Math.sin(theta));

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    return path;
  }
}