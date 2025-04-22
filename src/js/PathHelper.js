// v1.30.0 https://github.com/markroland/path-helper

/**
 * PathHelper class
 * @author Mark Roland
 * @license Creative Commons Attribution-ShareAlike 4.0 International License
 */
class PathHelper {

  /*************************************/
  // General operations
  /*************************************/

  /**
   * Class constructor
   * @param {function} prng - A Psuedo-Random Number Generator (PRNG).
   * This can be set to use a different random number generator than
   * Math.random(). This is very useful for creating consistent,
   * deterministic results from a PRNG that uses an initial seed value.
   * @returns null
   **/
  constructor(prng = null) {
    this.prng = prng;
  }

  /**
   * Get information about a 2D path
   * @param {array} path - A path
   * @returns {object} An object with information about the object
   * including its X/Y dimension range and center point
   */
  info(path) {
    let results = {
      "min": this.getMin(path),
      "max": this.getMax(path),
      "points": path.length
    };
    results.range = [
      results.max[0] - results.min[0],
      results.max[1] - results.min[1]
    ];
    results.center = [
      results.min[0] + results.range[0]/2,
      results.min[1] + results.range[1]/2
    ];
    return results;
  }

  /**
   * Create a deep copy of a JavaScript array/object
   * @todo Look into structuredClone
   * @param {array|object} a - The thing to be copied
   * @returns {array|object} An independent copy of the input value
   **/
  deepCopy(a) {
    return JSON.parse(JSON.stringify(a));
  }

  /**
   * Simplify the precision of floating point numbers in a Paths array
   * @param {array} paths - An array of Path arrays
   * @returns {array} - An array of Path arrays
   **/
  pathsToFixed(paths, precision = 2) {
    return paths.map(function(path){
      return path.map(function(point) {
        return point.map(function(number) {
          return parseFloat(number.toFixed(precision));
        });
      });
    });
  }

  /**
   * Convert the points in a path from an array to an object
   * @param {array} path - A Path array of Points with first element
   * as the x component and second element as the y component
   * @returns {array} A Path array of Point objects with "x" and "y"
   * properties
   **/
  pathPointsArrayToObject(path) {
    let new_path = [];
    for (let point of path) {
      new_path.push({x: point[0], y: point[1]});
    }
    return new_path;
  }

  /**
   * Convert the points in a path from an object to an array
   * @param {array} path - A Path array of Point objects with "x" and "y"
   * properties
   * @returns {array} path - A Path array of Points with first element
   * as the x component and second element as the y component
   **/
  pathPointsObjectToArray(path) {
    let new_path = [];
    for (let point of path) {
      new_path.push([point.x, point.y]);
    }
    return new_path;
  }

  /**
   * Get the values from a single column in the input array
   * @param {array} arr - The input array
   * @param {number} n - The array offset to isolate
   * @returns {array}
   **/
  arrayColumn(arr, n){
    return arr.map(a => a[n]);
  }

  /**
   * Get the minimum value from each coordinate compononent of a path
   * Supports 2D and 3D.
   * @param {array} path - A Path array
   * @returns {array} An array with the minimum value for each dimension
   **/
  getMin(path) {
    let x_coordinates = this.arrayColumn(path, 0);
    let y_coordinates = this.arrayColumn(path, 1);
    if (path[0].length === 3) {
      let z_coordinates = this.arrayColumn(path, 2);
      return [
        this.arrayMin(x_coordinates),
        this.arrayMin(y_coordinates),
        this.arrayMin(z_coordinates)
      ];
    }
    return [
      this.arrayMin(x_coordinates),
      this.arrayMin(y_coordinates),
    ];
  }

  /**
   * Get the maximum value from each coordinate compononent of a path
   * Supports 2D and 3D.
   * @param {array} path - A Path array
   * @returns {array} An array with the maximum value for each dimension
   **/
  getMax(path) {
    let x_coordinates = this.arrayColumn(path, 0);
    let y_coordinates = this.arrayColumn(path, 1);
    if (path[0].length === 3) {
      let z_coordinates = this.arrayColumn(path, 2);
      return [
        this.arrayMax(x_coordinates),
        this.arrayMax(y_coordinates),
        this.arrayMax(z_coordinates)
      ];
    }
    return [
      this.arrayMax(x_coordinates),
      this.arrayMax(y_coordinates),
    ];
  }

  /**
   * Get the Bounding Box coordinates for a 2D or 3D path
   * @param {array} path - A Path array
   * @returns {array} A multidimensional array with the minimum and maximum values for each dimension
   **/
  boundingBox(path) {
    let mins = this.getMin(path);
    let maxs = this.getMax(path);
    let bbox = [
      [mins[0], maxs[0]],
      [mins[1], maxs[1]]
    ];

    if (mins.length === 3 && maxs.length === 3) {
      bbox.push([mins[2], maxs[2]]);
    }

    return bbox;
  }

  /**
   * Get the smallest number from an array
   * @param {array} a - An array of numbers
   * @returns {number} The smallest number from the input
   **/
  arrayMin(a) {
    return Math.min(...a);
  }

  /**
   * Get the largest number from an array
   * @param {array} a - An array of numbers
   * @returns {number} The largest number from the input
   **/
  arrayMax(a) {
    return Math.max(...a);
  }

  /**
   * Get a Random Integer (whole number) between two values (inclusive)
   * Reference: https://www.w3schools.com/js/js_random.asp
   * @param {number} min - The lower bound of acceptable values
   * @param {number} max - The upper bound of acceptable values
   * @param {function} prng - An optional Psuedo-random number generator function
   * @return {number} - A randomly selected number
   */
  getRndInteger(min, max, prng = null) {
    if (typeof prng == 'function') {
      return Math.floor(prng() * (max - min + 1) + min);
    } else if (typeof this.prng == 'function') {
      return Math.floor(this.prng() * (max - min + 1) + min);
    } else {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }

  /**
   * Get a Random Number between two values (inclusive)
   * @param {number} [min=0] - The lower bound of acceptable values
   * @param {number} [max=1] - The upper bound of acceptable values
   * @param {function} prng - An optional Psuedo-random number generator function
   * @return {number} - A randomly selected number
   */
  getRandom(min = 0, max = 1, prng = null) {
    if (typeof prng == 'function') {
      return prng() * (max - min) + min;
    } else if (typeof this.prng == 'function') {
      return this.prng() * (max - min) + min;
    } else {
      return Math.random() * (max - min) + min;
    }
  }

  /**
   * Get a Random number within a Gaussian Distribution probability
   * From Stack Overflow - https://stackoverflow.com/a/49434653
   * Uses the Box-Muller transform (https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform)
   * Currently unverified
   * @param {number} [u=0] - Should be left at zero
   * @param {number} [v=0] - Should be left at zero
   * @param {function} prng - An optional Psuedo-random number generator function
   * @return {number} - A randomly selected number between 0.0 and 1.0
   */
  getGaussianRandom(u = 0, v = 0, prng = null) {
    // Converting [0,1) to (0,1)
    while(u === 0) {
      if (typeof prng == 'function') {
        u = prng();
      } else {
        u = this.getRandom(0, 1, this.prng);
      }
    }
    while(v === 0) {
      if (typeof prng == 'function') {
        v = prng();
      } else {
        v = this.getRandom(0, 1, this.prng);
      }
    }
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      // resample between 0 and 1
      return this.getGaussianRandom();
    }
    return num;
  }

  /**
   * Map a value from one scale to another scale
   * @param {number} value - The value to be mapped
   * @param {number} in_min - The minimum value on the current scale
   * @param {number} in_max - The maximum value on the current scale
   * @param {number} out_min - The minimum value on the new scale
   * @param {number} out_max - The maximum value on the new scale
   * @return {number} - The mapped value
   */
  map (value, in_min, in_max, out_min, out_max) {

    if (in_min == in_max) {
      return out_min;
    }

    // Shift negative values up into positive range
    if (in_min < 0 || in_max < 0) {
      in_max = in_max + -in_min;
      value = value + -in_min;
      in_min = in_min + -in_min;
    }
    return out_min + (out_max - out_min) * ((value - in_min) / (in_max - in_min));
  }

  /**
   * Clamp a value within a range of numbers. If the input
   * value is below the acceptable minimum, then the passed in
   * minimum value will be returned. If the input value is
   * over the acceptable maximum, then the passed in maximum value
   * will be returned.
   * @param {number} value - an input number
   * @param {number} min - Minimum acceptable value
   * @param {number} max - Maximum acceptable value
   * @returns {number} The clamped value
   **/
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Perform a linear interpolation between two values
   * @param {number} beginning - The start of the scale
   * @param {number} end - The end of the scale
   * @param {number} percent - The percentage (0.0 to 1.0) to be selected along the input range
   * @return {number} - The interpolated value
   **/
  lerp(beginning, end, percent) {
    return beginning + (end - beginning) * percent;
  }

  /**
   * Convert Degrees to Radians
   * @param {number} degrees
   * @returns {number} The input number represented in units of Radians
   **/
  degreesToRadians(degrees) {
    return degrees * (Math.PI/180);
  }

  /**
   * Convert Radians to Degrees
   * @param {number} radians
   * @returns {number} The input number represented in units of Degrees
   **/
  radiansToDegrees(radians) {
    return radians * (180/Math.PI);
  }

  /**
   * Convert Polar radius/angle coordinates to Rectangular (Cartesian) coordinates
   * @param {number} radius - The radius of the point (from the origin)
   * @param {number} theta - The angle of the point (from the origin) in Radians
   * from the positive X axis (3 O'clock direction). Positive theta is in the
   * counter-clockwise direction
   * @returns {array} An array of length two, where the first parameter is
   * the X position and the second the Y position
   **/
  polarToRect(radius, theta) {
    return [
      radius * Math.cos(theta),
      radius * Math.sin(theta)
    ];
  }

  /**
   * Convert Rectangular (Cartesian) coordinates to Polar radius/angle coordinates
   * @param {number} x - An X position relative to the origin
   * @param {number} y - A Y position relative to the origin
   * @returns {object} An object containing a 'radius' parameter that is the distance
   * from the origin to the point [x,y] and a `theta` parameter` that is the angle
   * from the positive X axis (3 O'clock direction). Positive theta is in the
   * counter-clockwise direction
   **/
  rectToPolar(x, y) {
    return {
      'radius': this.distance([0, 0], [x, y]),
      'theta': Math.atan2(y, x)
    };
  }

  /**
   * Calculate the Greatest Common Divisor (or Highest Common Factor) of 2 numbers
   *
   * https://en.wikipedia.org/wiki/Greatest_common_divisor
   * https://www.geeksforgeeks.org/c-program-find-gcd-hcf-two-numbers/
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  greatestCommonDivisor(a, b) {
    if (b == 0) {
      return a;
    }
    return this.greatestCommonDivisor(b, a % b);
  }

  /*************************************/
  // Mathematical Formulas and Calculations
  /*************************************/

  /**
   * Calculate the cross product of A and B
   * @param {array} a - A 3D Vector (an Array consisting of three Numbers)
   * @param {array} b - A 3D Vector (an Array consisting of three Numbers)
   * @returns {array} The Cross Product of A cross B (an Array consisting of three Numbers)
   */
  crossProduct(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  /**
   * Calculate the dot product of two matrices
   * @param Array Input Matrix
   * @param Array Input Matrix
   * @return Integer Scalar dot product
   */
  dotProduct(a, b) {
    let dot_product = 0;
    for (let i = 0; i < a.length; i++) {
      dot_product += a[i] * b[i]
    }
    return dot_product;
  }

  /**
   * Multiply two matrices
   * @param {array} a - Input Matrix
   * @param {array} b - Input Matrix
   * @return Array
   */
  matrixMultiply(a, b) {
    if (a[0].length != b.length) {
      throw 'Columns of Input A does not match Rows of Input B in matrixMultiply';
    }
    let result = [];
    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < a[0].length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  /**
   * Returns objet representing Line equation.
   * @param {array} p1 - A Point array
   * @param {array} p2 - A Point array
   * @returns {object} Returns an object with parameter "m" representing
   * the slope and a parameter "b" representing the Y intercept.
   **/
  lineSlopeIntercept(p1, p2) {
    let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    let b = p1[1] - m * p1[0];
    return {"m": m, "b": b};
  }

  /**
   * Solve the Quadratic Equation. For real values only
   *
   * Standard Quadratic Equation: ax^2 + bx + c = 0
   *
   * @param {number} a - Parameter `a` of the standard quadratic equation
   * @param {number} b - Parameter `b` of the standard quadratic equation
   * @param {number} c - Parameter `c` of the standard quadratic equation
   * @returns {array} A 2-element array containing real solutions of x or
   * and empty array for non-real solutions of x
   */
  solveQuadratic(a, b, c) {

    let discriminant = Math.pow(b, 2) - 4 * a * c;

    // One real and equal answer
    if (discriminant === 0) {
      let x = -b / (2 * a);
      return [x];
    }

    // Two real and different answers
    if (discriminant > 0) {
      let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      return [x1, x2];
    }

    return [];
  }

  /**
   * Calculate the distance between two points in 2D or 3D space
   * @param {array} p1 - A Point array containing two values for x and y.
   * @param {array} p2 - A Point array containing two values for x and y.
   * @returns {number} - The distance between the two points
   */
  distance(p1, p2) {

    // 3D Distance calculation
    if (p1.length == 3 && p2.length == 3) {
      return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[2] - p1[2], 2));
    }

    // 2D Distance calculation
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  }

  /**
   * Calculate the point equidistance from two points
   * @param {array} p1 - A Point array containing two values for x and y.
   * @param {array} p2 - A Point array containing two values for x and y.
   * @returns {array} - A Point array
   **/
  midpoint(p1, p2) {
    return [
      this.lerp(p1[0], p2[0], 0.5),
      this.lerp(p1[1], p2[1], 0.5)
    ];
  }

  /**
   * Calculate the angle between 3 points
   *
   *    (A: p1)
   *      /
   *     /
   *    /________
   *   (C: p2)   (B: p3)
   *
   * @param {array} p1 - Point 1. Endpoint "A"
   * @param {array} p2 - Point 2. Midpoint/Vertex "C"
   * @param {array} p3 - Point 3. Endpoint "B"
   * @returns {number} - The angle in radians
   */
  angle(p1, p2, p3) {

    let angle;

    // Define the distances of the sides of the triangle
    let a = this.distance(p2, p3);
    let b = this.distance(p1, p2);
    let c = this.distance(p3, p1);

    // Use the Law of Cosines to calculate the angle ACB
    let acos_arg = (
      (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2))
      /
      (2 * a * b)
    );

    // Round to a high, but reasonable level of precision
    // to avoid errors at very obtuse angles (nearing 180 degrees)
    acos_arg = acos_arg.toFixed(8);
    if (Math.abs(acos_arg) > 1) {
      console.log("Invalid acos() argument: " + acos_arg + ". Points may be collinear.");
      return 0;
    }

    // Gamma angle in radians. This is the angle of ACB
    angle = Math.acos(acos_arg);

    return angle;
  }

  /**
   * Calculate the Menger curvature formed by 3 points
   * https://en.wikipedia.org/wiki/Menger_curvature
   * @param {array} p1 - A Point array containing two values for x and y for the starting point.
   * @param {array} p2 - A Point array containing two values for x and y for the mid point.
   * @param {array} p3 - A Point array containing two values for x and y for the ending point.
   * @returns {number} - The curvature
   */
  curvature(p1, p2, p3) {
    let angle = this.angle(p1, p2, p3);
    let curvature = (2 * Math.sin(angle)) / this.distance(p1, p3);
    return curvature;
  }

  /*************************************/
  // Shapes
  /*************************************/

  /**
   * Create a regular convex polygon centered at the origin
   * @param {number} sides - The number of sides for the shape
   * @param {number} radius - The radius of the shape - the distance from the center to a vertex
   * @param {number} [rotation=0] - An optional rotation to be applied to the shape
   * @return {array} - An array of Points for the vertices of the shape. The first
   * and last points will overlap to create a closed path.
   **/
  polygon(sides, radius, rotation = 0) {
    let polygon = [];
    let polygon_theta = 0.0;
    for (let a = 0; a <= sides; a++) {
      polygon_theta = (a/sides) * (2 * Math.PI);
      polygon.push([
        radius * Math.cos(polygon_theta + rotation),
        radius * Math.sin(polygon_theta + rotation)
      ]);
    }
    return polygon;
  }

  /**
   * Draw a Rectangle
   * @param {number} width - The width of the rectangle
   * @param {number} height - The heighth of the rectangle
   * @returns {array} A Path Array
   **/
  rectangle(width, height) {
    return [
      [-width/2, -height/2],
      [ width/2, -height/2],
      [ width/2,  height/2],
      [-width/2,  height/2],
      [-width/2, -height/2]
    ];
  }

  /**
   * Draw an Ellipse
   * @param {number} a - The distance from the center to the major axis (length)
   * @param {number} b - The distance from the center to the minor axis (height)
   * @param {number} [segments=60] - The number of segments that make up the path
   * @return {array} A Path Array
   **/
  ellipse(a, b, segments = 60) {

    let path = [];

    for (let i = 0; i < segments; i++) {
      let theta = i/segments * 2 * Math.PI;
      path.push([
        a * Math.cos(theta),
        b * Math.sin(theta)
      ]);
    }

    path.push(path[0]);

    return path;
  }

  /**
   * Create a regular star polygon centered at the origin
   * @param {number} [star_points=5] - The number of points to the star
   * @param {number} [outer_radius=1.0] - The distance from the center to the outer points
   * @param {number} [inner_radius=0] - The distance from the center to the concave points
   * @return {array} - An array of Points for the vertices of the shape. The first
   * and last points will overlap to create a closed path.
   **/
  star(star_points = 5, outer_radius = 1.0, inner_radius = 0.5) {

    let shape = [];

    let i_max = star_points * 2;
    for (let i = 0; i < i_max; i++) {

      let radius = outer_radius;
      let theta = (i / i_max) * 2 * Math.PI;

      // Inner point
      if (i % 2 == 1) {
        radius = inner_radius;
      }

      shape.push([
        radius * Math.cos(theta),
        radius * Math.sin(theta)
      ]);
    }

    // Close shape
    shape.push(shape[0]);

    return shape;
  }

  /**
   * Create a parabola path
   * @param {number} focus - The focal distance of the parabola
   * @param {number} width - The width of the parabola to return
   * @param {number} segments - The number of segments to use to describe
   * the path. A higher number increases the smoothness of the path.
   * @return {array} - An array of Points defining a Path
   **/
  parabola(focus, width, segments) {
    let path = [];
    for (let a = 0; a <= segments; a++) {
      let x = this.map(a, 0, segments, -width/2, width/2);
      let y = focus * Math.pow(x,2);
      path.push([x,y]);
    }
    return path;
  }

  /**
   * Compose an arc between 2 points
   * @param {number} x1 - X-position of starting point
   * @param {number} y1 - Y-position of starting point
   * @param {number} x2 - X-position of end point
   * @param {number} y2 - Y-position of end point
   * @param {number} theta - rotation/angle to travel
   * @param {number} [segments=12] - The number of steps to use. A higher
   * number cfeates a smoother path
   * @returns {array} A Path array
   **/
  arcPointToPoint(x1, y1, x2, y2, theta, segments = 12) {
    let path = [];
    let theta_0 = Math.atan2(y2 - y1, x2 - x1);
    let distance = this.distance([x1, y1], [x2, y2]);
    for (let c = 1; c < segments; c++) {
      path.push([
        x1 + (x2 - x1)/2 + distance/2 * Math.cos(theta_0 + Math.PI + c/segments * theta),
        y1 + (y2 - y1)/2 + distance/2 * Math.sin(theta_0 + Math.PI + c/segments * theta)
      ]);
    }
    return path;
  }

  /**
   * Compose an arc centered at a position
   * @param {array} position - A Point array defining a position [x,y]
   * @param {number} radius - The radius of the arc from the position
   * @param {number} theta - The number of radians to rotate through the circular arc
   * @param {number} theta_offset - A radian offset from which to start the arc
   * @param {number} segments - The number of line segments used to render the arc
   * @returns {array} A Path array of points
   **/
  arc(position, radius, theta, theta_offset, segments) {
    let path = [];
    for (let s = 0; s <= segments; s++) {
      path.push([
        position[0] + radius * Math.cos(theta_offset + s/segments * theta),
        position[1] + radius * Math.sin(theta_offset + s/segments * theta)
      ]);
    }
    return path;
  }

  /**
   * Create a Quadratic Bezier curve using 3 control points
   * @param {array} p1 - Control Point number 1. This is the start of the curve path.
   * @param {array} p2 - Control Point number 2. This is the middle control point.
   * @param {array} p3 - Control Point number 3. This is the end of the curve path.
   * @param {number} segments - The number of segments to use to represent the curve. A
   * higher number will create a smoother, high-resolution curve
   * @returns {array} A Path array
   **/
  quadraticBezierPath(p1, p2, p3, segments) {
    let path = [];
    for (let i = 0; i <= segments; i++) {
      let t = i/segments;
      path.push([
        Math.pow(1-t, 2) * p1[0] + 2 * (1-t) * t * p2[0] + Math.pow(t, 2) * p3[0],
        Math.pow(1-t, 2) * p1[1] + 2 * (1-t) * t * p2[1] + Math.pow(t, 2) * p3[1]
      ]);
    }
    return path;
  }

  /**
   * Create a Cubic Bezier curve using 4 control points
   * Equation from https://javascript.info/bezier-curve
   * @param {array} p1 - Control Point number 1. This is the start of the curve path.
   * @param {array} p2 - Control Point number 2. This is the control point nearest the start point p1.
   * @param {array} p3 - Control Point number 3. This is the control point nearest the end point p4.
   * @param {array} p4 - Control Point number 4. This is the end of the curve path.
   * @param {number} segments - The number of segments to use to represent the curve. A
   * higher number will create a smoother, high-resolution curve
   * @returns {array} A Path array
   */
  cubicBezierPath(p1, p2, p3, p4, segments) {
    let path = [];
    for (let i = 0; i <= segments; i++) {
      let t = i/segments;
      path.push([
        Math.pow(1-t, 3) * p1[0] + 3 * Math.pow(1-t, 2) * t * p2[0] + 3 * (1-t) * Math.pow(t,2) * p3[0] + Math.pow(t,3) * p4[0],
        Math.pow(1-t, 3) * p1[1] + 3 * Math.pow(1-t, 2) * t * p2[1] + 3 * (1-t) * Math.pow(t,2) * p3[1] + Math.pow(t,3) * p4[1]
      ]);
    }
    return path;
  }

  /*************************************/
  // Linear Transformations
  /*************************************/

  /**
   * Translate a group of paths to be centered around the origin
   * @param {array} paths - An array of Path arrays
   * @returns {array} An array of Path arrays centered at the origin
   **/
  centerPaths(paths) {

    let x;
    let x_min;
    let x_max;
    let y;
    let y_min;
    let y_max;

    // Get the most extreme points (bounds) from all paths
    for (let i = 0; i < paths.length; i++) {

      // Get X coordinates as an 1-dimensional array
      let x_coordinates = this.arrayColumn(paths[i], 0);

      x = Math.min(...x_coordinates);
      if (typeof x_min == "undefined" || x < x_min) {
        x_min = x;
      }

      x = Math.max(...x_coordinates);
      if (typeof x_max == "undefined" || x > x_max) {
        x_max = x;
      }

      // Get Y coordinates as an 1-dimensional array
      let y_coordinates = this.arrayColumn(paths[i], 1);

      y = Math.min(...y_coordinates);
      if (typeof y_min == "undefined" || y < y_min) {
        y_min = y;
      }

      y = Math.max(...y_coordinates);
      if (typeof y_max == "undefined" || y > y_max) {
        y_max = y;
      }
    }

    // Determine offset of X direction
    let x_range = x_max - x_min;
    let x_center_offset = x_min + x_range/2;

    // Determine offset of Y direction
    let y_range = y_max - y_min;
    let y_center_offset = y_min + y_range/2;

    // Translate each path
    for (let i = 0; i < paths.length; i++) {
      paths[i] = this.translatePath(paths[i], [-x_center_offset, -y_center_offset]);
    }

    return paths;
  }

  /**
   * Scale a Path with respect to the origin
   * @param {array} path - A Path array. Supports 2D and 3D.
   * @param {number|number[]} scale - The amount by which to scale
   * the path. A single numeric value can be applied to all dimensions
   * or a value can be provided for each dimension
   * @returns {array} A Path array
   **/
  scalePath(path, scale) {
    let scale_x = scale;
    let scale_y = scale;
    let scale_z = scale;
    if (scale.length !== undefined) {
      scale_x = scale[0];
      scale_y = scale[1];
      scale_z = scale[2] !== undefined ? scale[2] : 1;
    }
    return path.map(function(a){
      let scaled = [
        a[0] * scale_x,
        a[1] * scale_y
      ];
      if (a.length == 3) {
        scaled.push(a[2] * scale_z);
      }
      return scaled;
    });
  }

  /**
   * Translate a path
   * @param {array} path - A Path array
   * @param {number[]} delta - The amount by which to move
   * the path in each dimension
   * @returns {array} A Path array
   **/
  translatePath(path, delta) {
    return path.map(function(a){
      return [
        a[0] + delta[0],
        a[1] + delta[1]
      ];
    });
  }

  /**
   * Rotate Path by angle theta around a center point ([0,0] by default)
   * @param {array} path - A Path array
   * @param {number} theta - The number of radians to
   * rotate the path. Positive rotation is clockwise.
   * @param {array[]} center - A Point array. The point around which to rotate.
   * @returns {array} A Path array
   **/
  rotatePath(path, theta, center = [0,0]) {
    return path.map(function(a){
      return this.rotatePoint(a, theta, center);
    }, this);
  }

  /**
   * Rotate a point around another point
   * Reference: https://danceswithcode.net/engineeringnotes/rotations_in_2d/rotations_in_2d.html
   * @param {array} point - A Point array
   * @param {number} theta - The number of radians to
   * rotate the path. Positive rotation is clockwise.
   * @param {array[]} center - A Point array. The point around which to rotate.
   * @returns {array} A Point array
   **/
  rotatePoint(point, theta, center = [0,0]) {
    return [
      (point[0] - center[0]) * Math.cos(theta) - (point[1] - center[1]) * Math.sin(theta) + center[0],
      (point[0] - center[0]) * Math.sin(theta) + (point[1] - center[1]) * Math.cos(theta) + center[1]
    ];
  }

  /**
   * Reflect a Path (array of points) about an axis (X or Y)
   * @param {array} path - The path to be reflected
   * @param {string} component=("x"|"y"|"horizontal"|"vertical") - The component whose value
   * should be inverted, "x" or "y". A flip of "y" will be a vertical reflection over the x axis.
   * A flip of "x" will be a horizontal reflection over the y axis. This was implemented
   * counterintuitively the first time, so an adjustment was made to the variable names and
   * "horizontal" and "vertical" input options were added to match traditional implementations.
   * @param {number} [offset=0.0] - An optional offset value. The origin is the default
   * @returns {array} A Path array
   */
  reflectPath(path, component, offset = 0.0) {
    return path.map(function(point){
      if (component == "x" || component == "horizontal") {
        return [
          -(point[0] - offset) + offset,
          point[1]
        ];
      } else if (component == "y" || component == "vertical") {
        return [
          point[0],
          -(point[1] - offset) + offset,
        ];
      } else {
        return point;
      }
    });
  }

  /**
   * Shear (Skew) a Path (array of points) horizontally or vertically
   * @param {array} path - The path to be sheared
   * @param {string} direction=("horizontal"|"vertical") - The axis along which to skew "x" or "Y").
   * @param {number} slope - The slope of the shear (e.g. "1" is a 45-degree sheer in the positive direction)
   * @param {boolean} [preserve_starting_point=false] - Set this to true so that the first point
   * in the path maintains its position
   * @returns {array} A Path array
   */
  shearPath(path, direction, slope, preserve_starting_point = false) {

    // Keep a copy of the first point for use when preserve_starting_point is true
    const pre_skew = path[0];

    // Set the shear matrix. Horizontal by default
    // Note: The Shear Matrix is related to the input order of matrixMultiply.
    // This order was chosen based on the Path points being defined as [x,y]
    let shear_matrix = [
      [1, 0],
      [slope, 1]
    ];
    if (direction == "vertical") {
      shear_matrix = [
        [1, slope],
        [0, 1]
      ];
    }

    // Apply the shear matrix
    const self = this;
    path =  path.map(function(point) {
      let shear;
      try {
        shear = self.matrixMultiply([point], shear_matrix)[0];
      } catch(e) {
        console.log(e);
      }
      return shear;
    });

    // Translate the path to preserve the starting point
    if (preserve_starting_point) {
      path = this.translatePath(path, [
        -[path[0][0] - pre_skew[0]],
        -[path[0][1] - pre_skew[1]]
      ]);
    }

    return path;
  }

  /**
   * Free Distort a Path
   * @param {array} path - A Path array
   * @param {array} bounding_box - An array of 4 points representing the bounding box of the path.
   * Points should start in the top-left and proceed clockwise.
   * A -- B
   * |    |
   * D -- C
   * @param {array} distortion - An array of 4 points representing the distorted points of the bounding box.
   * Points should start in the top-left and proceed clockwise
   * A ------ B
   *  \      /
   *   \    /
   *   D - C
   * @return {array} The transformed shape
   **/
  distortPath(path, bounding_box, distortion) {

    // The distortion array must always contain four points
    // representing the transformation, starting in the top-left
    // and going clockwise.
    if (distortion.length != 4) {
      console.log("distortion array length must be four.");
      return [];
    }

    // Initialize output
    let transformed_path = [];

    // Get bounding box of shape
    const shape_info = this.info(bounding_box);

    // Loop through points of the input path
    for (let j = 0; j < path.length; j++) {

      let x_delta_percent = (path[j][0] - shape_info.min[0]) / shape_info.range[0];
      let y_delta_percent = (path[j][1] - shape_info.min[1]) / shape_info.range[1];

      // Map the current point's X position to the top of the distortion quadrilateral
      let p_top = [
        this.lerp(
          distortion[0][0],
          distortion[1][0],
          x_delta_percent
        ),
        this.lerp(
          distortion[0][1],
          distortion[1][1],
          x_delta_percent
        ),
      ];

      // Map the current point's X position to the bottom of the distortion quadrilateral
      let p_bottom = [
        this.lerp(
          distortion[3][0],
          distortion[2][0],
          x_delta_percent
        ),
        this.lerp(
          distortion[3][1],
          distortion[2][1],
          x_delta_percent
        ),
      ];

      // Interpolate the current point's Y position between the top and bottom of the
      // distortion quadrilateral
      let p_prime = [
        this.lerp(
          p_top[0],
          p_bottom[0],
          y_delta_percent
        ),
        this.lerp(
          p_top[1],
          p_bottom[1],
          y_delta_percent
        ),
      ];

      // Add the new point to the output
      transformed_path.push(p_prime);
    }

    return transformed_path;
  }

  /*************************************/
  // Boolean Shape Operations
  /*************************************/

  /**
   * Perform a Boolean addition (union) of two closed paths
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - An array of points representing Shape B added to Shape A.
   * If Shape B does not overlap Shape A, then Shape A will be returned unchanged.
   **/
  booleanAdd(shapeA, shapeB) {

    // Ensure that shapes are closed (e.g. Last point matches first point)
    if (!this.pointEquals(shapeA[shapeA.length-1], shapeA[0], 0.0001)) {
      shapeA.push(shapeA[0]);
    }
    if (!this.pointEquals(shapeB[shapeB.length-1], shapeB[0], 0.0001)) {
      shapeB.push(shapeB[0]);
    }

    // Get intersections
    let newA = this.shapeIntersections(shapeA, shapeB);
    let newB = this.shapeIntersections(shapeB, shapeA);

    // Build a new shape from the two shapes using the segments
    // that are outside of the other shape
    let newShape = [];
    newShape = newShape.concat(this.booleanAddComparison(newA, shapeB));
    newShape = newShape.concat(this.booleanAddComparison(newB, shapeA));

    // Join all of the path segments into a continuous path
    newShape = this.joinPaths(newShape);

    return newShape;
  }

  /**
   * Remove segments of Shape A that are inside of Shape B
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - A multidimensional array of paths from Shape A
   * that are outside of Shape B
   **/
  booleanAddComparison(shapeA, shapeB) {
    let paths = [];

    let shapeB_vertices = this.#formatVertices(shapeB);

    let path = [];
    let i_max = shapeA.length-1;
    for (let i = 0; i < i_max; i++) {
      let mid_point = [
        this.lerp(shapeA[i][0], shapeA[i+1][0], 0.5),
        this.lerp(shapeA[i][1], shapeA[i+1][1], 0.5),
      ];
      if (this.pointInPolygon(shapeB_vertices, mid_point[0], mid_point[1])) {
        path.push(shapeA[i]);
        if (path.length > 1) {
          paths.push(path);
        }
        path = [];
      } else {
        path.push(shapeA[i]);
      }
      // Add last point if end of loop... I'm not convinced this is correct
      if (i == i_max - 1) {
        path.push(shapeA[i+1]);
      }
    }
    if (path.length > 1) {
      paths.push(path);
    }

    return paths;
  }

  /**
   * Perform a Boolean subtraction (difference) of two closed paths
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - An array of points representing Shape B removed from Shape A.
   * If Shape B does not overlap Shape A, then Shape A will be returned unchanged.
   **/
  booleanSubtract(shapeA, shapeB) {

    // Ensure that shapes are closed (e.g. Last point matches first point)
    if (!this.pointEquals(shapeA[shapeA.length-1], shapeA[0], 0.0001)) {
      shapeA.push(shapeA[0]);
    }
    if (!this.pointEquals(shapeB[shapeB.length-1], shapeB[0], 0.0001)) {
      shapeB.push(shapeB[0]);
    }

    // Get intersections
    let newA = this.shapeIntersections(shapeA, shapeB);
    let newB = this.shapeIntersections(shapeB, shapeA);

    // Build a new shape from the two shapes using the segments
    // that are outside of the other shape
    let newShape = [];
    newShape = newShape.concat(this.booleanSubtractComparison(newA, shapeB));
    newShape = newShape.concat(this.booleanSubtractComparison(newB, shapeA, true));

    // Join all of the path segments into a continuous path
    newShape = this.joinPaths(newShape);

    return newShape;
  }

  /**
   * Remove segments of Shape B that are outside of Shape A
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - A multidimensional array of paths from Shape A
   * that are outside of Shape B
   **/
  booleanSubtractComparison(shapeA, shapeB, invert = false) {
    let paths = [];

    // Extract and reformat vertices from shapeB for use with this.pointInPolygon
    let shapeB_vertices = this.#formatVertices(shapeB);

    // Loop through all segments of Shape A and determine if they are inside
    // or outside of Shape B
    let path = [];
    let i_max = shapeA.length-1;
    for (let i = 0; i < i_max; i++) {

      // Get the midpoint of the segment as the point to compare
      let mid_point = [
        this.lerp(shapeA[i][0], shapeA[i+1][0], 0.5),
        this.lerp(shapeA[i][1], shapeA[i+1][1], 0.5),
      ];

      if (!invert) {

        if (this.pointInPolygon(shapeB_vertices, mid_point[0], mid_point[1], 0.00001)) {
          path.push(shapeA[i]);
          if (path.length > 1) {
            paths.push(path);
          }
          path = [];
        } else {
          path.push(shapeA[i]);
        }
        // Add last point if end of loop... I'm not convinced this is correct
        if (i == i_max - 1) {
          path.push(shapeA[i+1]);
        }

      } else {

        if (!this.pointInPolygon(shapeB_vertices, mid_point[0], mid_point[1], -0.00001)) {
          path.push(shapeA[i]);
          if (path.length > 1) {
            paths.push(path);
          }
          path = [];
        } else {
          path.push(shapeA[i]);
        }
        // Add last point if end of loop... I'm not convinced this is correct
        if (i == i_max - 1) {
          path.push(shapeA[i+1]);
        }

      }
    }
    if (path.length > 1) {
      paths.push(path);
    }

    return paths;
  }

  /**
   * Perform a Boolean intersection of two closed paths
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - An array of points representing the overlapping
   * region(s) of Shape A and Shape B. If there is no overlap an empty
   * shape should be returned
   **/
  booleanIntersect(shapeA, shapeB) {

    // Ensure that shapes are closed (e.g. Last point matches first point)
    if (!this.pointEquals(shapeA[shapeA.length-1], shapeA[0], 0.0001)) {
      shapeA.push(shapeA[0]);
    }
    if (!this.pointEquals(shapeB[shapeB.length-1], shapeB[0], 0.0001)) {
      shapeB.push(shapeB[0]);
    }

    // Get intersections
    let newA = this.shapeIntersections(shapeA, shapeB);
    let newB = this.shapeIntersections(shapeB, shapeA);

    // Build a new shape from the two shapes using the segments
    // that are outside of the other shape
    let newShape = [];
    newShape = newShape.concat(this.booleanIntersectionComparison(newA, shapeB));
    newShape = newShape.concat(this.booleanIntersectionComparison(newB, shapeA));

    // Join all of the path segments into a continuous path
    newShape = this.joinPaths(newShape);

    return newShape;
  }

  /**
   * Remove segments of Shape B that are outside of Shape A
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - A multidimensional array of paths from Shape A
   * that are outside of Shape B
   **/
  booleanIntersectionComparison(shapeA, shapeB) {
    let paths = [];

    // Extract and reformat vertices from shapeB for use with this.pointInPolygon
    let shapeB_vertices = this.#formatVertices(shapeB);

    // Loop through all segments of Shape A and determine if they are inside
    // or outside of Shape B
    let path = [];
    let i_max = shapeA.length-1;
    for (let i = 0; i < i_max; i++) {

      // Get the midpoint of the segment as the point to compare
      let mid_point = [
        this.lerp(shapeA[i][0], shapeA[i+1][0], 0.5),
        this.lerp(shapeA[i][1], shapeA[i+1][1], 0.5),
      ];

      if (!this.pointInPolygon(shapeB_vertices, mid_point[0], mid_point[1])) {
        path.push(shapeA[i]);
        if (path.length > 1) {
          paths.push(path);
        }
        path = [];
      } else {
        path.push(shapeA[i]);
      }

      // Add last point if end of loop... I'm not convinced this is correct
      if (i == i_max - 1) {
        path.push(shapeA[i+1]);
      }

    }
    if (path.length > 1) {
      paths.push(path);
    }

    return paths;
  }

  /**
   * Calculate the intersection points of Shape A with Shape B,
   * and insert these intersection points in Shape A (in order)
   *
   * @param {array} shapeA - An array of points defining a closed shape
   * @param {array} shapeB - An array of points defining a closed shape
   *
   * @returns {array} - An array of points representing Shape A with
   * the intersection points of Shape B added
   **/
  shapeIntersections(shapeA, shapeB) {

    let newA = [];

    // Loop through points of Shape A
    for (let i = 0; i < shapeA.length - 1; i++) {

      // Add the starting point
      newA.push(shapeA[i]);

      // Analyze current line segment of Shape A for intersections
      // with all segments of Shape B
      let segment_intersections = [];
      for (let j = 0; j < shapeB.length-1; j++) {

        // Test for point on line first
        let on_line = this.pointOnLineSegment(
          shapeB[j],
          [shapeA[i], shapeA[i+1]],
          0.0000001
        );
        if (on_line) {
          segment_intersections.push(shapeB[j]);
          continue;
        }

        let intersect = this.getLineLineCollision(
          {x: shapeA[i][0], y: shapeA[i][1]},
          {x: shapeA[i+1][0], y: shapeA[i+1][1]},
          {x: shapeB[j][0], y: shapeB[j][1]},
          {x: shapeB[j+1][0], y: shapeB[j+1][1]}
        );

        if (intersect) {
          segment_intersections.push([
            intersect.x,
            intersect.y
          ]);
        }
      }

      // Sort segment_intersections and insert in Shape A
      if (segment_intersections.length > 0) {
        let self = this;
        segment_intersections.sort(function(a, b) {
          return (self.distance(shapeA[i], a) > self.distance(shapeA[i], b) ? 1 : -1)
        });
        newA = newA.concat(segment_intersections);
      }
    }

    // Close shape
    newA.push(shapeA[shapeA.length - 1]);

    return newA;
  }

  /*************************************/
  // Path Operations
  /*************************************/

  /**
   * Calculate the total distance of a path of two or more points
   * @param {array} path - A Path array
   * @returns {number} - The total distance of the path
   */
  pathLength(path) {
    let distance = 0.0;
    for (let i = 0; i < path.length-1; i++) {
      distance += this.distance(path[i], path[i+1]);
    }
    return distance;
  }

  /**
   * Determine if two lines are equivalent
   * @param {array} a - A path containing two points
   * @param {array} b - A path containing two points
   * @param {number} [threshold=0] -  A maximum distance points can be apart and considered equal
   * @returns {boolean} True if the same, false otherwise
   */
  lineEquals(a, b, threshold = 0) {
    if (this.pointEquals(a[0], b[0], threshold) && this.pointEquals(a[1], b[1], threshold)) {
      return true;
    }
    return false;
  }

  /**
   * Determine if two points are equivalent (coincident)
   * @param {array} a - A point array containing two values for x and y
   * @param {array} b - A point array containing two values for x and y
   * @param {number} [threshold=0] - A maximum distance points can be apart and considered equal
   * @returns {boolean} True if the same, false otherwise
   */
  pointEquals(a, b, threshold = 0) {
    if (threshold === 0 && a[0] === b[0] && a[1] === b[1]) {
      return true;
    } else if (this.distance(a, b) <= threshold) {
      return true;
    }
    return false;
  }

  /**
   * Determine if a Path is closed, i.e. the last point is coincident with the starting point
   * @param {array} A path containing at least three points
   * @param {number} [threshold=0] -  A maximum distance points can be apart and considered equal
   * @returns {boolean} True if the path is closed, false otherwise
   */
  closedPath(path, threshold = 0.0001) {
    if (path.length < 3) {
      return false;
    }
    if (this.pointEquals(path[path.length-1], path[0], threshold)) {
      return true;
    }
    return false;
  }

  /**
   * Determine if a path intersects with itself.
   * For the purpose of this method, closed paths - where the first and last
   * points are coincident - are not considered to be self-interesecting.
   * @param {array} path - A Path array
   * @returns {boolean} True if the path intersects itself, false otherwise
   **/
  selfIntersectingPath(path) {

    // Note: No need to test the final two segments since any existing
    // intersections would have already been found and two consecutive
    // segments (3 points) can't intersect
    for (let i = 0; i < path.length - 2; i++) {

      const segment = [
        path[i],
        path[i+1]
      ];

      // Check for an intersection between the segment being analyzed (segment)
      // and each remaining segment (test_segment) of the path
      for (let j = i + 2; j < path.length - 1; j++) {

        const test_segment = [
          path[j],
          path[j+1]
        ];

        // Check for intersection
        let intersection = this.getLineLineCollision(
          {"x": segment[0][0], "y": segment[0][1]},
          {"x": segment[1][0], "y": segment[1][1]},
          {"x": test_segment[0][0], "y": test_segment[0][1]},
          {"x": test_segment[1][0], "y": test_segment[1][1]}
        );

        // Return true as soon as any intersection is determined
        if (intersection !== false) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Determine if a path is a simple polygon. A simple polygon
   * is a closed path (first and last points are coincident) that
   * does not intersect itself.
   * @param {array} path - A Path array
   * @returns {boolean} True if the path is a simple polygon, false otherwise
   **/
  simplePolygon(path) {

    // Check that the path is closed and therefore a valid "shape"
    if (!this.closedPath(path)) {
      return false;
    }

    // Check that the path is not self-intersecting
    if (this.selfIntersectingPath(path)) {
      return false;
    }

    return true;
  }

  /**
   * Determine if a path is a complex polygon. A complex polygon
   * is a closed path (first and last points are coincident) that
   * intersects itself.
   * @param {array} path - A Path array
   * @returns {boolean} True if the path is a complex polygon, false otherwise
   **/
  complexPolygon(path) {

    // Check that the path is closed and self-intersects
    if (this.closedPath(path) && this.selfIntersectingPath(path)) {
      return true;
    }

    return false;
  }

  /**
   * Determine if a path is a convex polygon.
   * @param {array} path - A Path array
   * @returns {boolean} True if the path is a convex polygon, false otherwise
   **/
  convexPolygon(path) {

    // Check that the shape is a simple polygon (closed and not self-intersecting)
    if (!this.simplePolygon(path)) {
      throw 'The Path is not a simple polygon.';
      return false;
    }

    let this_sign = 0;
    let last_sign = 0;
    for (let i = 1; i < path.length; i++) {

      //     (A: p1)
      //       /
      //      /
      //     /________
      //    (C: p2)   (B: p3)
      const p1 = path[i-1];
      const p2 = path[i];
      const p3 = path[i+2];

      let vector_a = [
        p1[0] - p2[0],
        p1[1] - p2[1],
        0
      ];
      let vector_b = [
        p3[0] - p2[0],
        p3[1] - p2[1],
        0
      ];
      let cross_product = this.crossProduct(vector_a, vector_b);

      // Check the z-direction of the Cross Product
      if (cross_product[2] > 0) {
        this_sign = 1;
      } else {
        this_sign = -1;
      }

      // Check iterations after the first iteration
      if (i > 1) {

        // If the sign/direction has changed then the shape is not Convex
        if (this_sign != last_sign) {
          return false;
        }
      }

      last_sign = this_sign;
    }

    return true;
  }

  /**
   * Determine if a path is a concave polygon.
   * @param {array} path - A Path array
   * @returns {boolean} True if the path is a concave polygon, false otherwise
   **/
  concavePolygon(path) {
    return !this.convexPolygon(path);
  }

  /**
   * Calculate the location where two lines (p1-to-p2 and p3-to-p4) intersect
   * Copied from https://editor.p5js.org/mwburke/sketches/h1ec1s6LG
   * @param {array} p1 - Starting point of Line A
   * @param {array} p2 - Ending point of Line A
   * @param {array} p3 - Starting point of Line B
   * @param {array} p4 - Ending point of Line B
   * @return {array} - An array defining a point of intersection
   **/
  intersect_point(p1, p2, p3, p4) {
    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) -
      (p4[1] - p3[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) -
      (p2[1] - p1[1]) * (p1[0] - p3[0])) /
      ((p4[1] - p3[1]) * (p2[0] - p1[0]) -
      (p4[0] - p3[0]) * (p2[1] - p1[1]));

    const x = p1[0] + ua * (p2[0] - p1[0]);
    const y = p1[1] + ua * (p2[1] - p1[1]);

    return [x, y];
  }

  /**
   * Calculate if and where two finite line segments intersect
   * From https://stackoverflow.com/a/30159167
   * @param {array} p0 - A point array containing two values for x and y. Start Point of Line A
   * @param {array} p1 - A point array containing two values for x and y. End Point of Line A
   * @param {array} p2 - A point array containing two values for x and y. Start Point of Line B
   * @param {array} p3 - A point array containing two values for x and y. End Point of Line B
   * @returns {} An intersection point object {x,y} if an intersection is found. False otherwise.
   */
  getLineLineCollision(p0, p1, p2, p3) {

    var s1, s2;
    s1 = {x: p1.x - p0.x, y: p1.y - p0.y};
    s2 = {x: p3.x - p2.x, y: p3.y - p2.y};

    var s10_x = p1.x - p0.x;
    var s10_y = p1.y - p0.y;
    var s32_x = p3.x - p2.x;
    var s32_y = p3.y - p2.y;

    var denom = s10_x * s32_y - s32_x * s10_y;

    if(denom === 0) {
        return false;
    }

    var denom_positive = denom > 0;

    var s02_x = p0.x - p2.x;
    var s02_y = p0.y - p2.y;

    var s_numer = s10_x * s02_y - s10_y * s02_x;

    if((s_numer < 0) == denom_positive) {
        return false;
    }

    var t_numer = s32_x * s02_y - s32_y * s02_x;

    if((t_numer < 0) == denom_positive) {
        return false;
    }

    if((s_numer > denom) == denom_positive || (t_numer > denom) == denom_positive) {
        return false;
    }

    var t = t_numer / denom;

    var p = {x: p0.x + (t * s10_x), y: p0.y + (t * s10_y)};
    return p;
  }

  /**
   * Calculate the intersection points (0, 1 or 2) between a line and a circle
   * @param {array} p1 - A Point array defining the start of a line segment
   * @param {array} p2 - A Point array defining the end of a line segment
   * @param {array} circle - An array defining a circle. The first parameter should
   * be the circle's position, represented as a Point array, and the secord
   * parameter should be the circle's radius.
   * @returns {array} An array with 0, 1 or 2 Point array elements representing the
   * locations of intersections.
   */
  lineCircleIntersect(p1, p2, circle) {

    let intersections = [];

    // Get line.m and line.b
    let line = this.lineSlopeIntercept(p1, p2);

    let r = circle[1];

    // Note: This is for circle at origin only right now
    let a = Math.pow(line.m, 2) + 1;
    let b = 2 * line.m * line.b;
    let c = Math.pow(line.b, 2) - Math.pow(r,2);

    let x_values = this.solveQuadratic(a, b, c);

    if (x_values.length === 0) {
      return intersections;
    }

    for (let x_value of x_values) {

      let intersect = [
        x_value,
        line.m * x_value + line.b
      ];

      // Determine if coordinate is on the line p1->p2
      if (this.pointOnLineSegment(intersect, [p1, p2])) {
        intersections.push(intersect);
      }
    }

    return intersections;
  }

  /**
   * Calculate an intersection point of two circles
   * https://math.stackexchange.com/questions/256100/how-can-i-find-the-points-at-which-two-circles-intersect
   * https://www.analyzemath.com/CircleEq/circle_intersection.html
   * See alternate implementation: https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
   * @param {array} p1 - Point array of x/y position ([x,y]) of Circle 1
   * @param {number} r1 - Radius of Circle 1
   * @param {array} p2 - Point array of x/y position ([x,y]) of Circle 2
   * @param {number} r2 - Radius of Circle 2
   * @param {number} sign=1|+1|-1 - Look for one of two points
   * @returns {array} - A Point array
   **/
  circleInterceptPoints(p1, r1, p2, r2, sign) {

    // Distance between centers of the circles
    let d = this.distance(p1, p2);

    let x = (1/2) * (p1[0] + p2[0])
      + ((Math.pow(r1, 2) - Math.pow(r2, 2)) / (2 * Math.pow(d, 2))) * (p2[0] - p1[0])
      + sign * (1/2) * Math.sqrt(
          2 * ((Math.pow(r1, 2) + Math.pow(r2, 2))/(Math.pow(d, 2)))
          - Math.pow((Math.pow(r1, 2) - Math.pow(r2, 2)), 2) / Math.pow(d, 4)
          - 1
        ) * (p2[1] - p1[1]);

    let y = (1/2) * (p1[1] + p2[1])
      + ((Math.pow(r1, 2) - Math.pow(r2, 2)) / (2 * Math.pow(d, 2))) * (p2[1] - p1[1])
      + sign * (1/2) * Math.sqrt(
          2 * ((Math.pow(r1, 2) + Math.pow(r2, 2))/(Math.pow(d, 2)))
          - Math.pow((Math.pow(r1, 2) - Math.pow(r2, 2)), 2) / Math.pow(d, 4)
          - 1
        ) * (p1[0] - p2[0]);

    return [x,y];
  }

  /**
   * Check if a Point is on a Line Segment (or within a threshold/buffer)
   * This is from Jeffrey Thompson's excellent eBook on Collission Detection
   * online at http://www.jeffreythompson.org/collision-detection/line-circle.php
   *
   *   | length + buffer  |
   *   |                 ||
   *   A ------_-------- B
   *   |       p         |
   *   |   d1  |    d2   |
   *
   * @param {array} p - A Point array
   * @param {array} line - A 2-point Path array
   * @param {number} [buffer=0.01] - A value representing a maximum difference between the length
   * of the line and the length of the distance from the line start to point `p` to the line end
   * and still be considered as "on" the line segment.
   * @returns {boolean} True if the point is on the line (or within the buffer). False otherwise.
   **/
  pointOnLineSegment(p, line, buffer = 0.01) {
    let d1 = this.distance(p, line[0]);
    let d2 = this.distance(p, line[1]);
    let lineLen = this.distance(line[0], line[1]);
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
  }

  /**
   * PolyPoint from http://www.jeffreythompson.org/collision-detection/poly-point.php
   * Threshold has been added so that points very close to the border of the
   * polygon can be selecteive counted as in or out
   * @param {array} vertices - Vertices of Polygon
   * @param {number} px - X Position of Point
   * @param {number} py - Y Position of Point
   * @param {number} [threshold=-0.00001] - The Threshold at which to consider a point near the border as either
   * inside or outside.
   * @returns {boolean} - True if the point is inside the Polygon, false otherwise
   **/
  pointInPolygon(vertices, px, py, threshold = -0.00001) {

    let collision = false;

    // go through each of the vertices, plus
    // the next vertex in the list
    let next = 0;
    for (let current=0; current<vertices.length; current++) {

      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) {
        next = 0;
      }

      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = vertices[current];
      let vn = vertices[next];

      // compare position, flip 'collision' variable back and forth
      let within_vertical_band = (vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py);
      let jordan_curve_theorem = (vn.x-vc.x) * (py-vc.y) / (vn.y-vc.y) + vc.x;
      if (within_vertical_band && px < jordan_curve_theorem) {
        collision = !collision;
      }

      // If the point is within the threshold of a border, then
      // return right away. If the threshold is positive, then be
      // more permissive for counting the point as inside the polyon.
      // If the threshold is negative, then be less permissive with
      // including the point in the polygon
      let on_line = this.pointOnLineSegment(
        [px, py],
        [[vc.x, vc.y], [vn.x, vn.y]],
        Math.abs(threshold)
      );
      if (on_line) {
        if (threshold > 0) {
          return true;
        } else {
          return false;
        }
      }

    }

    return collision;
  }

  /**
   * Create a parallel path to two points
   *
   *    (C) -------- (D) (Positive Offset)
   * p1 (A) -------- (B) p2
   *    (C) -------- (D) (Negative Offset)
   *
   *  Cross product of BA X AC indicates positive side
   *
   * @param {array} p1 - A Point array
   * @param {array} p2 - A Point array
   * @param {number} offset_amount - The distance to offset the
   * parallel path
   * @returns {array} - A Path array
   */
  parallelPath(p1, p2, offset_amount) {

    // Calculate the slope of the line AB as an angle
    let delta_y = p2[1] - p1[1];
    let delta_x = p2[0] - p1[0];
    let theta = Math.atan2(delta_y, delta_x);

    // Line A is a line perpendicular to the line AB, starting
    // at point A
    let line_A = [
      p1,
      [
        p1[0] + offset_amount * Math.cos(theta + Math.PI/2),
        p1[1] + offset_amount * Math.sin(theta + Math.PI/2)
      ]
    ];

    // Line B is a line perpendicular to the line BA, starting
    // at point B
    let line_B = [
      p2,
      [
        p2[0] + offset_amount * Math.cos(theta + Math.PI/2),
        p2[1] + offset_amount * Math.sin(theta + Math.PI/2)
      ]
    ];

    // Use the endpoints from Lines A and B to construct
    // a new line that is parallel to AB
    return [line_A[1], line_B[1]];
  }

  /**
   * Expand a Path
   * @param {array} path - A Path array
   * @param {number} offset_start - The expansion offset at the start of the path
   * @param {number} offset_end - the expansion offset at the end of the path
   * @param [string} [capStyle="open"|"flat"|"round"] - The Cap style at the end of the line: 'open', 'flat', 'round'
   * @returns {array} A multidimensional array of one or more paths. "open" has 2 paths
   * while "flat" and "round" is one continuous path.
   **/
  expandPath(path, offset_start, offset_end, capStyle = 'open') {

    let parallels = [];
    let parallel = [];
    let parallel_segment;
    let offset = offset_start;
    let i_max = path.length-1;

    // Outer
    parallel = [];
    for (let i = 0; i < i_max; i++) {
      offset = offset_start + (offset_end - offset_start) * (i/i_max);
      parallel_segment = this.parallelPath(path[i], path[i+1], offset);
      parallel.push(parallel_segment[0]);
    }

    // Push the last point
    parallel_segment = this.parallelPath(path[path.length-2], path[path.length-1], offset_end);
    parallel.push(parallel_segment[1]);

    parallels.push(parallel);

    // Inner
    parallel = [];
    for (let i = 0; i < i_max; i++) {
      offset = offset_start + (offset_end - offset_start) * (i/i_max);
      parallel_segment = this.parallelPath(path[i], path[i+1], -offset);
      parallel.push(parallel_segment[0]);
    }

    // Push the last point
    parallel_segment = this.parallelPath(path[path.length-2], path[path.length-1], -offset_end);
    parallel.push(parallel_segment[1]);

    parallels.push(parallel);

    let output;
    switch (capStyle) {
      case 'flat':
        output = parallels[0].concat(parallels[1].reverse());
        output.push(parallels[0][0]);
        return [output];
      case 'round':
        parallels[1].reverse();

        output = parallels[0];

        // Cap
        output = output.concat(this.arcPointToPoint(
            parallels[0][parallels[0].length-1][0],
            parallels[0][parallels[0].length-1][1],
            parallels[1][0][0],
            parallels[1][0][1],
            -Math.PI,
            6
          )
        );

        output = output.concat(parallels[1]);

        // Cap
        output = output.concat(this.arcPointToPoint(
            parallels[1][parallels[1].length-1][0],
            parallels[1][parallels[1].length-1][1],
            parallels[0][0][0],
            parallels[0][0][1],
            -Math.PI,
            6
          )
        );

        // Last point
        output.push(parallels[0][0]);

        return [output];
      default:
        return parallels;
    }
  }

  /**
   * Offset a Path
   * @param {array} path - An array of points. Must contain at least 3 points.
   * @param {number|function} offset - the offset distance of the path. A negative number
   * represents an "inside" offset for an acute angle ACB. A function can also be used
   * where the input value is a number betweeen 0 and 1 representing the current point's
   * array index as a percentage. The output of the function is a numerical offset value.
   * @param {boolean} [prevent_knots=false] - Remove segments of the offset that
   * intersect with themselve in order to support wider offset values
   * @returns {array} A multidimensional path array of points
   **/
  offsetPath(path, offset, prevent_knots = false) {

    if (path.length < 3) {
      throw 'Input path must contain 3 or more points';
    }

    let offset_path = [];

    // Create a copy so that elements can be removed without
    // effecting source array
    let source_path = JSON.parse(JSON.stringify(path));

    if (this.distance(source_path[0], source_path[source_path.length-1]) < 0.0001) {

      // Closed path ("shape")

      // Remove the last point if the first and last points are the same (or very close)
      // This is required for closed shapes
      source_path.pop();

      // Loop through points and calculate the offset for the next 2 line segments
      for (let i = 0; i < source_path.length; i++) {
        let j = (i + 1) % source_path.length;
        let k = (i + 2) % source_path.length;
        let offset_angle = this.offsetAngle(source_path[i], source_path[j], source_path[k], -offset);
        offset_path.push(offset_angle[1]);
      }

      // Close path by adding first point
      offset_path.push(offset_path[0]);

    } else {

      // Open path
      let i_max = source_path.length-3;
      for (let i = 0; i <= i_max; i++) {
        let j = i + 1;
        let k = i + 2;

        // Determine the offset distance as a static value from the input or as a function
        // of the path's distance (0.0 - 1.0)
        let offset_dist;
        if (typeof offset == "function") {
          offset_dist = offset(i/i_max);
        } else {
          offset_dist = offset;
        }

        let offset_angle = this.offsetAngle(source_path[i], source_path[j], source_path[k], -offset_dist);

        if (i === 0) {
          offset_path.push(offset_angle[0]);
          offset_path.push(offset_angle[1]);
        } else if (i === i_max) {
          offset_path.push(offset_angle[1]);
          offset_path.push(offset_angle[2]);
        } else {
          offset_path.push(offset_angle[1]);
        }
      }
    }

    if (isNaN(offset_path[offset_path.length-1][0])) {
      console.log("NaN Error");
      console.log(offset_path);
    }

    // Remove "knots" from the path
    if (prevent_knots) {
      offset_path = this.removeKnots(offset_path);
    }

    return offset_path;
  }

  /**
   * Remove parts of a path where it intersects with itself creating a loop/knot.
   * @param {array} path - An array of points. Must contain at least 3 points.
   * @returns {array} A Path array
   **/
  removeKnots(path) {

    if (path.length < 3) {
      throw 'Input path must contain 3 or more points';
    }

    let last_intersect_index = 0;

    // Initialize the final path with 2 segments (3 points)
    // These could be co-linear but can't have a singular intersection point.
    // Co-linearal overlap isn't being tested as it's unlikely to occur.
    let final_path = path.slice(0, 3);

    // Loop through all points of the input path starting with the last point
    // of the "final_path"
    for (let i = 2; i < path.length-1; i++) {

      // The "previous_path" is 1 segment short of the "segment" value
      // The endpoint of previous_path should NOT match the beginning
      // point of segment because that could result in an intersection "hit"
      // and this is not what we want at a "hinge" point in the line
      // let previous_path = path.slice(0, i);
      let previous_path = path.slice(last_intersect_index, i);
      const segment = [path[i], path[i+1]];

      for (let j = last_intersect_index; j < previous_path.length - 1; j++) {

        // Check for an intersection between the segment being analyzed
        // and each segment of the previous path
        let intersection = this.getLineLineCollision(
          {"x": segment[0][0], "y": segment[0][1]},
          {"x": segment[1][0], "y": segment[1][1]},
          {"x": previous_path[j][0], "y": previous_path[j][1]},
          {"x": previous_path[j+1][0], "y": previous_path[j+1][1]}
        );

        if (intersection == false) {

          // No intersection, so add point
          final_path.push(path[i]);
          continue;

        } else {

          // Intersection found

          // Reset final paths to go up to the point previous
          // to the intersection
          final_path = previous_path.slice(0, j+1);

          // Add intersection point
          final_path.push([
            intersection.x,
            intersection.y
          ]);

          // Add end of segment
          if (i+2 < path.length) {
            final_path.push(path[i+2]);
          }

          // Set index for next loop. This may not be necessary
          last_intersect_index = i + 1;

          // Add the remainder of the original path to the cleaned path
          final_path = final_path.concat(path.slice(i+3));

          // Analyze this new path for knots.
          // TODO: I believe This could be made more efficient by passing in an
          // position index of where to start further intersection analyze.
          // Without this the analysis starts over from the beginning of the path
          final_path = this.removeKnots(final_path);

          return final_path;
        }
      }
    }

    // Return the original path if no intersections were found
    return final_path;
  }

  /**
   * Offset a path of 3 points
   *
   * INTENDED TO BE PRIVATE METHOD OF CLASS
   *
   *    (A: p1)
   *      /
   *     /
   *    /________
   *   (C: p2)   (B: p3)
   *
   * @param {array} p1 - Point 1. Endpoint "A"
   * @param {array} p2 - Point 2. Midpoint/Vertex "C"
   * @param {array} p3 - Point 3. Endpoint "B"
   * @param {number} offset - the offset distance of the path. A negative number
   * represents an "inside" offset for an acute angle ACB
   * @returns {array} A path array of 3 points
   **/
  offsetAngle(p1, p2, p3, offset) {

    // Gamma angle in radians. This is the angle of ACB
    let gamma = this.angle(p1, p2, p3);

    // Calculate the distance that the side AC (or CB)
    // must be extended (or subtracted) in order to turn
    // around (or inside) vertex C
    let corner_offset = offset * Math.tan(Math.PI/2 - (0.5 * gamma));

    // Calculate the parallel offset path from point 1 to 2 (Side AC)
    let AC_offset = this.parallelPath(p1, p2, offset);

    // Compute the Cross Product of the vector CA with vector CB
    // to determine if the parallel path is on the interior or
    // exterior of the angle. If the magnitude of the cross product
    // is negative, then invert the corner offset magnitude.
    let vector_a = [
      p1[0] - p2[0],
      p1[1] - p2[1],
      0
    ];
    let vector_b = [
      p3[0] - p2[0],
      p3[1] - p2[1],
      0
    ];
    let cross_product = this.crossProduct(vector_a, vector_b);
    if (cross_product[2] < 0) {
      corner_offset = corner_offset * -1;
    }

    // Extend/Reduce the line by the Corner Offset distance
    AC_offset = this.extendLine(AC_offset[0], AC_offset[1], 0, corner_offset);

    // Calculate the parallel offset path from point 2 to 3 (Side CB)
    let CB_offset = this.parallelPath(p2, p3, offset);

    // Combine the 2 offset sides to get the new path
    let expanded_path = AC_offset;
    expanded_path.push(CB_offset[1]);

    return expanded_path;
  }

  /**
   * Extend the line segment between points A and B by an amount in either direction
   * @param {array} A - The starting Point
   * @param {array} B - The ending Point
   * @param {number} deltaA - The amount to extend the line from Point A
   * @param {number} deltaB - The amount to extend the line from Point B
   * @return {array} A 2-point Path array
   **/
  extendLine(A, B, deltaA, deltaB) {

    // Extend line in 3 dimensions
    if (A.length == 3 && B.length == 3) {
      return this.#extendLine3D(A, B, deltaA, deltaB);
    }

    let theta = Math.atan2(B[1] - A[1], B[0] - A[0]);

    let new_A = [
      A[0] - (deltaA * Math.cos(theta)),
      A[1] - (deltaA * Math.sin(theta)),
    ];

    let new_B = [
      B[0] + (deltaB * Math.cos(theta)),
      B[1] + (deltaB * Math.sin(theta)),
    ];

    return [new_A, new_B];
  }

  /**
   * Extend the line segment between points A and B by an amount in either direction in 3 dimensions
   * @param {array} A - The starting Point
   * @param {array} B - The ending Point
   * @param {number} deltaA - The amount to extend the line from Point A
   * @param {number} deltaB - The amount to extend the line from Point B
   * @return {array} A 3-point Path array
   **/
  #extendLine3D(A, B, deltaA, deltaB) {

    if (A.length != 3 || B.length != 3) {
      throw "Points must have 3 dimensions."
    }

    let vector = [
      B[0] - A[0],
      B[1] - A[1],
      B[2] - A[2]
    ];

    let magnitude = Math.sqrt(
      Math.pow(vector[0], 2) +
      Math.pow(vector[1], 2) +
      Math.pow(vector[2], 2)
    );

    let unit_vector = vector.map(function(point) {
      return point / magnitude;
    });

    let new_A = [
      A[0] + deltaA * unit_vector[0],
      A[1] + deltaA * unit_vector[1],
      A[2] + deltaA * unit_vector[2]
    ];

    let new_B = [
      B[0] + deltaB * unit_vector[0],
      B[1] + deltaB * unit_vector[1],
      B[2] + deltaB * unit_vector[2]
    ];

    return [new_A, new_B];
  }

  /**
   * Extend a path in a predictive manner using previous curvature
   * of the path
   * @param {array} path - An array of points.
   * @param {number} [factor=1.0] - A multiplication factor to apply
   * to the new angle. A value over 1.0 will increase the angle (decreasing)
   * the curvature. A value under 1.0 will decrease the angle (increasing the
   * curvature).
   * @todo Consider adding another parameter to determine average curvature
   * over several points
   * @returns {array} A Path array
   **/
  extendPath(path, factor = 1.0) {

    const PathHelp = new PathHelper();

    let new_path = PathHelp.deepCopy(path);

    const last_index = path.length-1;

    let previous_distance = PathHelp.distance(path[last_index], path[last_index-1]);

    let next_angle;

    if (typeof path[last_index-2] !== "undefined") {

      const p1 = path[last_index-2];
      const p2 = path[last_index-1];
      const p3 = path[last_index];

      let base_angle = Math.atan2(
        p2[1] - p3[1],
        p2[0] - p3[0]
      );

      let previous_bend = PathHelp.angle(
        path[last_index-2],
        path[last_index-1],
        path[last_index]
      );

      previous_bend = factor * previous_bend;

      // Calculate cross product to keep angles consistent
      const vector_a = [
        p1[0] - p2[0],
        p1[1] - p2[1],
        0
      ];
      const vector_b = [
        p3[0] - p2[0],
        p3[1] - p2[1],
        0
      ];
      const cross_product = PathHelp.crossProduct(vector_a, vector_b);
      if (cross_product[2] < 0) {
        previous_bend = previous_bend * -1;
      }

      next_angle = base_angle + previous_bend;

    } else {

      let previous_angle = Math.atan2(
        path[last_index-1][1] - path[last_index][1],
        path[last_index-1][0] - path[last_index][0]
      );
      next_angle = previous_angle + Math.PI;
    }

    let next_point = [
      path[last_index][0] + previous_distance * Math.cos(next_angle),
      path[last_index][1] + previous_distance * Math.sin(next_angle)
    ]

    new_path.push(next_point);

    return new_path;
  }

  /**
   * Limit a Path's length to a maximum distance
   * @param {array} path - A Path array
   * @param {number} maximum_distance - The maximum distance, or length, of the path
   * @returns {array} A Path array that is trimmed to be the maximum distance. If no
   * trimming is necessary then the original path is returned.
   **/
  limitPathDistance(path, maximum_distance) {

    // Distance accumulator
    let total_distance = 0;

    // Start the path with the first point
    let new_path = [
      path[0]
    ];

    for (let i = 1; i < path.length; i++) {

      // Get distance of current segment
      let segment_distance = Math.hypot(path[i][0] - path[i-1][0], path[i][1] - path[i-1][1]);

      // If the total distance is below the threshold, then and the point (segment)
      // Otherwise, if it goes over determine by how much and shorten that segment
      // so that it meets the maximum distance
      if (total_distance + segment_distance < maximum_distance) {
        new_path.push(path[i]);
        total_distance += segment_distance;
      } else {
        let subtraction_amount = (total_distance + segment_distance) - maximum_distance;
        let new_segment = this.extendLine(path[i-1], path[i], 0, -subtraction_amount);
        new_path.push(new_segment[1]);
        return new_path;
      }
    }

    return new_path;
  }

  /**
   * Superimpose a function on a path
   * @param {array} path - A Path array
   * @param {function} fn - A function used to modify the input path
   * @returns {array} - A Path array
   **/
  superimposeFunction(base_path, fn) {

    if (typeof fn != "function") {
      throw 'fn parameter must be a function';
    }

    let path = [];

    // Calculate total distance of base path
    let total_distance = 0.0;
    for (let i = 0; i < base_path.length-1; i++) {
      let segment = [base_path[i], base_path[i+1]];
      let distance = this.distance(segment[0], segment[1]);
      total_distance += distance;
    }

    // Loop through base path
    let position = 0.0;
    const i_max = base_path.length-1;
    for (let i = 0; i <= i_max; i++) {

      // Define the current and next point
      let p1, p2;
      if (i == i_max) {
        p1 = base_path[i];
        p2 = base_path[i-1];
      } else {
        p1 = base_path[i];
        p2 = base_path[i+1];
      }

      // Calculate the distance between the 2 points
      if (i > 0) {
        position += this.distance(p1, p2);
      }

      // Call modification function
      let y = fn(position / total_distance);

      // Calculate perpendicular offset from line
      let delta_y = p2[1] - p1[1];
      let delta_x = p2[0] - p1[0];
      let theta = Math.atan2(delta_y, delta_x);

      path.push([
        p1[0] + y * Math.cos(theta + Math.PI/2),
        p1[1] + y * Math.sin(theta + Math.PI/2)
      ]);
    }

    return path;
  }

  /**
   * Add noise to a path
   * @param {array} path - The source path
   * @param {number} max_segment_length - The maximum distance allowed between points. If a segment
   * of the path is greater than this distance it will be subdivided into
   * shorter segments.
   * @param {number} max_noise - The maximum magnitude of the noise offset
   * @param {boolean} [gaussian=false] - Whether to use Guassian noise
   * @param {boolean} [force_close=false] - Whether to force the path to close (end point equals start point)
   * @param {number} [smooth_window=0] - An optional smoothing window value.
   * @param {number} [smooth_repeat=1] - An optional repetition of the smoothing window. Repeating a smaller
   * smoothing window more times keeps sharper angles while still smoothing straight lines.
   * @param {boolean} [anchor_start=false] - Whether to freeze the first point or not. Default is based on legacy behavior.
   * @param {boolean} [anchor_end=true] - Whether to freeze the last point or not. Default is based on legacy behavior.
   * @param {array} - A Path array
   */
  noisify(path, max_segment_length, max_noise, gaussian = false, force_close = false, smooth_window = 0, smooth_repeat = 1, anchor_start = false, anchor_end = true) {

    // Break full path into segments
    let path2 = this.dividePathComplete(path, max_segment_length);

    let newpath = [];

    let i_min = 0;
    if (anchor_start) {
      newpath.push(path2[0]);
      i_min = 1;
    }

    let i_max = path2.length-1;

    for (let i = i_min; i < i_max; i++) {

      let noise;

      if (gaussian) {
        noise = this.getGaussianRandom() * max_noise;
      } else {
        noise = this.getRandom(-max_noise, max_noise);
      }

      let delta_y = path2[i+1][1] - path2[i][1];
      let delta_x = path2[i+1][0] - path2[i][0];
      let theta = Math.atan2(delta_y, delta_x);
      newpath.push([
        path2[i][0] + noise * Math.cos(theta + Math.PI/2),
        path2[i][1] + noise * Math.sin(theta + Math.PI/2)
      ]);
    }

    // Add last point
    if (anchor_end) {
      newpath.push(path2[path2.length-1]);
    } else {

      let new_point = path2[path2.length-1];

      let noise;

      if (gaussian) {
        noise = this.getGaussianRandom() * max_noise;
      } else {
        noise = this.getRandom(-max_noise, max_noise);
      }

      let i = path2.length-1;
      let delta_y = path2[i][1] - path2[i-2][1];
      let delta_x = path2[i][0] - path2[i-2][0];
      let theta = Math.atan2(delta_y, delta_x);
      new_point = [
        path2[i][0] + noise * Math.cos(theta + Math.PI/2),
        path2[i][1] + noise * Math.sin(theta + Math.PI/2)
      ];

      newpath.push(new_point);
    }

    // Force a closed shape (end point equals start point)
    if (force_close) {
      if (!this.pointEquals(newpath[0], newpath[newpath.length-1])) {
        newpath.push(newpath[0]);
      }
    }

    if (smooth_window > 1) {
      for (let i = 0; i < smooth_repeat; i++) {
        newpath = this.smoothPath(newpath, smooth_window);
      }
    }

    return newpath;
  }

  /**
   * Smooth a path
   * @param {array} path - A Path array
   * @param {number} size - The smoothing window size. This should be an odd number
   * @param {string} [boundary="preserve"|"weight"|"extrapolate"|"trim"] - Boundary algorithm.
   * preserve - This is like "trim", except the input path's end points are appended. This was the function's original behavior.
   * This method can create relatively long segments toward the end of the line that can look out of place.
   * trim - This drops the points that are near the ends and don't have a full smoothing window. This method
   * does not create or add additional path data. It will shorten the path.
   * weight - This duplicates the endpoints to accomodate the window size. It will shorten the path, but not as much
   * as the trim method. It can result in some curling toward the endpoints since they are repeated.
   * extrapolate - This adds additional points that attempt to be at the same interval/distance as segments at the end of the path
   * and point in the same direction as the opposite side of the window. This maintains the original length and solves the
   * flat ending segemnts of the "preserve" method.
   * @returns {array} A Path array
   **/
  smoothPath(path, size = 3, boundary = "preserve") {

    if (size < 3) {
      throw 'Smoothing window size should be greater than or equal to 3.';
    }

    if (!["preserve", "weight", "extrapolate", "trim"].includes(boundary)) {
      throw '"boundary" parameter must be one of: preserve, weight, extrapolate, trim';
    }

    // Return the original path if the Path is shorter than the smoothing size
    if (path.length < size) {
      return path;
    }

    // Identify closed paths where the first and last points
    // are coincident
    let closed_path = false;
    if (this.pointEquals(path[0], path[path.length-1])) {
      closed_path = true;
    }

    // Init new path
    let new_path = [];

    // Build convolution kernel for smoothing
    let v = 1 / size;
    const kernel = new Array(size).fill(v);

    // Set the window index range
    let range = (size - 1) / 2;

    if (boundary == "weight") {
      // Pad to fill the window size
      let padding = Math.floor(size/2);
      path = new Array(padding).fill(path[0]).concat(path);
      path = path.concat(new Array(padding).fill(path[path.length-1]));

    } else if (boundary == "extrapolate") {

      const i_max = Math.floor(size/2);

      // Add points to beginning

      let first_segment_distance = this.distance(
        path[0],
        path[1]
      );

      // Get direction from original path endpoint to smoothing window extent
      let first_segment_angle = Math.atan2(
        path[0][1] - path[i_max][1],
        path[0][0] - path[i_max][0]
      );

      for (let i = 0; i < i_max; i++) {
        let previous_point = [
          path[0][0] + first_segment_distance * Math.cos(first_segment_angle),
          path[0][1] + first_segment_distance * Math.sin(first_segment_angle),
        ];
        path = [previous_point].concat(path);
      }

      // Add points to end

      const path_last_index = path.length - 1;

      let last_segment_distance = this.distance(
        path[path_last_index],
        path[path_last_index - 1]
      );

      // Get direction from original path endpoint to smoothing window extent
      let last_segment_angle = Math.atan2(
        path[path_last_index][1] - path[path_last_index - i_max][1],
        path[path_last_index][0] - path[path_last_index - i_max][0]
      );

      for (let i = 0; i < i_max; i++) {
        let next_point = [
          path[path.length-1][0] + last_segment_distance * Math.cos(last_segment_angle),
          path[path.length-1][1] + last_segment_distance * Math.sin(last_segment_angle),
        ];
        path.push(next_point);
      }
    }

    let i_min = 0;
    let i_max = path.length - 1;

    // Adjust beginning of path
    if (!closed_path) {
      i_min += range;
      i_max = path.length - range;

      if (boundary == "preserve") {
        new_path.push(path[0]);
      }
    }

    // Move smoothing window across path
    for (let i = i_min; i < i_max; i++) {

      // Initialize the X/Y component summations
      let sum = [0,0];

      // Loop through smoothing window
      for (let k = -range; k <= range; k++) {

        let index = i + k;
        if (closed_path) {
          index = ((path.length - 1) + (i + k)) % (path.length - 1);
        } else {
          if (index < 0 || index > path.length - 1) {
            continue;
          }
        }

        // Sum X and Y components
        sum[0] += path[index][0] * kernel[k+range];
        sum[1] += path[index][1] * kernel[k+range];
      }

      new_path.push(sum);
    }

    // Adjust end of path
    if (closed_path) {
      new_path.push(new_path[0]);
    } else {
      if (boundary == "preserve") {
        new_path.push(path[path.length - 1]);
      }
    }

    return new_path;
  }

  /**
   * Smooth the corners on a Path based on percentages
   * @param {array} path - An array of points representing the path to be modified
   * @param {number} sharpness - A value from 0 to 1. A sharpness of 0 represents the maximum amount of curvature
   * possible between adjacent points. A sharpness of 1 represents no change
   * @param {number} [bezier_segments=20] - The number of segments in the curve. More is smoother.
   * @return {array} A Path array
   */
  smoothCorners(path, sharpness, bezier_segments = 20) {

    // Don't exceed limits
    if (sharpness >= 1) {
      return path;
    }

    if (sharpness < 0) {
      sharpness = 0;
    }

    // Identify closed paths where the first and last points
    // are coincident
    let closed_path = false;
    if (this.pointEquals(path[0], path[path.length-1])) {
      closed_path = true;
    }

    // Map Sharpness to bend
    // Bend should range from >= 0.5 to < 1 so that
    // the path can be C2 continuous
    // Where 0.5 is the broadest bend and 1 is no bend
    let bend = this.map(sharpness, 0, 1, 0.5, 1);

    // Init new path
    let new_path = [];

    let i_min = 0;

    // First point won't have a bend
    if (!closed_path) {
      new_path.push(path[0]);
      i_min += 1;
    }

    for (let i = i_min; i < path.length - 1; i++) {

      let p1_index = i - 1;
      let p2_index = i;
      let p3_index = i + 1;
      if (closed_path) {
        p1_index = ((path.length - 1) + (i - 1)) % (path.length - 1);
        p2_index = i;
        p3_index = ((path.length - 1) + (i + 1)) % (path.length - 1);
      }

      // Create variables that are easier to read
      let op_p1 = path[p1_index];
      let op_p2 = path[p2_index];
      let op_p3 = path[p3_index];

      // Calculate points at which the bezier should start/end
      let p1_bend = [
        this.lerp(op_p1[0], op_p2[0], bend),
        this.lerp(op_p1[1], op_p2[1], bend),
      ];
      let p2_bend = [
        this.lerp(op_p3[0], op_p2[0], bend),
        this.lerp(op_p3[1], op_p2[1], bend),
      ];

      // Add curve
      let bezier = this.cubicBezierPath(
        p1_bend,
        op_p2,
        op_p2,
        p2_bend,
        bezier_segments
      );

      // Remove last point if bend is 0.5
      // In this case the end point of the current curve
      // matches the beginning point of the next curve
      if (bend === 0.5) {
        bezier.pop();
      }

      new_path = new_path.concat(bezier);
    }

    // Last point won't have a bend
    if (!closed_path) {
      new_path.push(path[path.length - 1]);
    } else {
      new_path.push(new_path[0]);
    }

    return new_path;
  }

  /**
   * Smooth the corners on a Path based on a radius distance
   * @param {array} path - An array of points representing the path to be modified
   * @param {number} radius - A numeric radius to apply to the corner
   * @param {number} [bezier_segments=20] - The number of segments in the curve. More is smoother.
   * @return {number} A Path array
   */
  radiusCorners(path, radius, bezier_segments = 20) {

    // Identify closed paths where the first and last points
    // are coincident
    let closed_path = false;
    if (this.pointEquals(path[0], path[path.length-1])) {
      closed_path = true;
    }

    // Init new path
    let new_path = [];

    let i_min = 0;

    // First point won't have a bend
    if (!closed_path) {
      new_path.push(path[0]);
      i_min += 1;
    }

    for (let i = i_min; i < path.length - 1; i++) {

      let p1_index = i - 1;
      let p2_index = i;
      let p3_index = i + 1;
      if (closed_path) {
        p1_index = ((path.length - 1) + (i - 1)) % (path.length - 1);
        p2_index = i;
        p3_index = ((path.length - 1) + (i + 1)) % (path.length - 1);
      }

      // Create variables that are easier to read
      let p1 = path[p1_index];
      let p2 = path[p2_index];
      let p3 = path[p3_index];

      // Calculate points at which the bezier should start/end
      let distance_p1_p2 = this.distance(p1, p2);
      let p1_bend = [
        this.lerp(p1[0], p2[0], (distance_p1_p2 - radius) / distance_p1_p2),
        this.lerp(p1[1], p2[1], (distance_p1_p2 - radius) / distance_p1_p2),
      ];

      let distance_p3_p2 = this.distance(p3, p2);
      let p2_bend = [
        this.lerp(p3[0], p2[0], (distance_p3_p2 - radius) / distance_p3_p2),
        this.lerp(p3[1], p2[1], (distance_p3_p2 - radius) / distance_p3_p2),
      ];

      // Add curve
      let bezier = this.cubicBezierPath(
        p1_bend,
        p2,
        p2,
        p2_bend,
        bezier_segments
      );

      new_path = new_path.concat(bezier);
    }

    // Last point won't have a bend
    if (!closed_path) {
      new_path.push(path[path.length - 1]);
    } else {
      new_path.push(new_path[0]);
    }

    return new_path;
  }

  /**
   * Shift and wrap the elements in the array
   * https://javascript.plainenglish.io/algorithms-101-rotate-array-in-javascript-three-solutions-260fbc923b64
   * @param {array} path - A Path array
   * @param {number} k - An integer number for how many elements to shift the array
   * @returns {array}
   */
  shiftPath(path, k) {
    if (path.length > k) {
        path.unshift( ...path.splice(-k));
    } else {
      let i = 0;
      while(i < k){
        path.unshift(path.splice(-1));
        i++;
      }
    }
    return path;
  }

  /**
   * Split each segment of the source path into 2 parts and return the result
   * @param {array} path - The source path
   * @returns {array} - The input path with each segment divided into two segments
   **/
  subdividePath(path) {

    let divided_path = [];

    for (let i = 0; i < path.length-1; i++) {

      // Current point
      divided_path.push(path[i]);

      // Point halfway to next point
      divided_path.push([
        path[i][0] + (path[i+1][0] - path[i][0])/2,
        path[i][1] + (path[i+1][1] - path[i][1])/2
      ]);
    }

    // Add the last point
    divided_path.push(path[path.length-1]);

    return divided_path;
  }

  /**
   * Split each segment of the source path into multiple segments
   * @param {array} line - A 2-Point Path array
   * @param {number} segments - The number of segments to create from the input line
   * @returns {array} A Path array
   **/
  dividePath(line, segments) {

    let divided_path = [];

    const start_point = line[0];
    const end_point   = line[1];
    for (let i = 0; i <= segments; i++) {
      divided_path.push([
        this.lerp(start_point[0], end_point[0], i/segments),
        this.lerp(start_point[1], end_point[1], i/segments)
      ]);
    }

    return divided_path;
  }

  /**
   * Break down a multi-point path into segments that don't
   * exceed a maximum segment length
   * @param {array} path - A Path array
   * @param {number} max_segment_length - If any segment of the path
   * is larger than this value, then the segment should be divided
   * into equal segments that are below this value.
   * @returns {array} A Path array
   **/
  dividePathComplete(path, max_segment_length) {
    let divided_path = [];
    for (let i = 0; i < path.length-1; i++) {
      let segment = [path[i], path[i+1]];
      let length = this.distance(segment[0], segment[1]);
      if (length > max_segment_length) {
        let subdivisions = Math.ceil(length / max_segment_length);
        let subdivided_segment = this.dividePath(segment, subdivisions);
        subdivided_segment.pop();
        divided_path = divided_path.concat(subdivided_segment);
      } else {
        divided_path.push(segment[0]);
      }
    }
    divided_path.push(path[path.length-1]);

    return divided_path;
  }

  /**
   * Turn a solid line/path into a dashed line
   * @todo This currently calculates dashes and gaps. This could probably be
   * optimized to only calculate one as necessary based on the value of "return_gaps"
   * @param {array} path - A Path array
   * @param {number} dash - The length of each dash
   * @param {number} gap - The distance between each dash
   * @param {boolean} [return_gaps=false] - Set to true to
   * receive the gaps instead of dashes as the output
   * @returns {array} An array of Path arrays
   **/
  dashPath(path, dash, gap, return_gaps = false) {

    // Initialize return value
    let dashes = {
      "dashes": [],
      "gaps": []
    };

    // --- Step 1: Upsample

    // Divide each segment so that it is subdivided by at least the minimum dash/gap
    // This is important so that
    let new_path = [];

    // Determine the smallest increment required to satisfy a dash or gap
    // The division is optional. It may or may not provide better precision.
    let increment = Math.min(dash, gap) / 3;

    for (let i = 0; i < path.length - 1; i++) {
      let divided_segment = this.dividePathComplete([path[i], path[i+1]], increment);

      // Remove last point of segment to avoid duplication with first point of next segment
      divided_segment.pop();

      new_path = new_path.concat(divided_segment);
    }

    // Add end point
    new_path.push(path[path.length-1]);

    // --- Step 2: Evaluate

    // Initialize state to start with a filled in dash (not a gap)
    let show = true;

    // Set the distance remaining based on if the state is a dash or gap
    let distance_remaining = show ? dash : gap;

    // Start new dash/gap segment with the first point
    let segment = [
      new_path[0]
    ];

    // Loop through all points of the upsampled path to select the next point
    // for the dash/gap segment
    const i_max = new_path.length - 1;
    for (let i = 0; i < i_max; i++) {

      // Get distance from the last point in the current segment to next point on target path
      let distance = this.distance(segment[segment.length - 1], new_path[i+1]);

      // Reduce the distance remaining before path state change
      distance_remaining -= distance;

      if (distance_remaining > 0) {

        // If more distance remains then add the point and continue to next loop iteration
        segment.push(new_path[i+1]);

      } else {

        // If the distance is exceeded then calculate the point on the target path's
        // segment where the distance is exactly met.

        const new_segment = this.extendLine(
          segment[segment.length - 1],
          new_path[i+1],
          0,
          distance_remaining
        );

        // Add calculated point as the last point to the current state's segment
        segment.push(new_segment[1]);

        // Add the segment to the appropriate part of the return object
        if (show) {
          dashes.dashes.push(segment);
        } else {
          dashes.gaps.push(segment);
        }

        // Reset state for next iteration
        // A) Start new segment with same point as last segment's end point
        segment = [
          new_segment[1]
        ];

        // B) Toggle dash/gap state
        show = !show;

        // C) Set the distance remaining based on if the state is a dash or gap
        distance_remaining = show ? dash : gap;
      }
    }

    // Add any remaining segments
    if (segment.length > 0) {
      if (show) {
        dashes.dashes.push(segment);
      } else {
        dashes.gaps.push(segment);
      }
    }

    if (return_gaps) {
      return dashes.gaps;
    }

    return dashes.dashes;
  }

  /**
   * Randomly remove portions of a path
   *
   * @param {array} path - A Path array
   * @param {number} odds - The odds (0 to 100% represented as 0 to 1.0) that any
   * point in the path should be removed, thereby terminating the current path
   * and establishing a new path with the next point
   *
   * @returns {array} An array of Paths
   **/
  decimatePath(path, odds = 0.05) {
    let new_paths = [];
    let new_path = [];
    for (let j = 0; j < path.length; j++) {
      if (this.getRandom(0, 1, this.prng) < odds) {
        if (new_path.length > 1) {
          new_paths.push(new_path);
        }
        new_path = [];
        continue;
      }
      new_path.push(path[j])
    }
    if (new_path.length > 1) {
      new_paths.push(new_path);
    }
    return new_paths;
  }

  /**
   * Randomly remove portions of multiple paths
   *
   * @param {array} paths - An array of Paths
   * @param {number} odds - The odds (0 to 100% represented as 0 to 1.0) that any
   * point in the path should be removed, thereby terminating the current path
   * and establishing a new path with the next point
   *
   * @param {array} An array of paths
   **/
  decimatePaths(paths, odds = 0.05) {
    let new_paths = [];
    for (let i = 0; i < paths.length; i++) {
      let temp_paths = this.decimatePath(paths[i], odds);
      if (temp_paths.length >= 1) {
        new_paths = new_paths.concat(temp_paths);
      }
    }
    return new_paths;
  }

  /**
   * Join Paths together when endpoints within threshold distance of each other
   * @param {array} paths - An array of Path arrays
   * @param {number} [threshold=0.01] - The distance threshold below which points should be considered the same location.
   * @param {number} [active_path_index=0] - The index position of the paths input that is being analyzed
   * @param {number} [iteration=0] - A counter of function call iterations. Useful for debugging and stopping the recursion
   * @returns {array} An array of paths
   **/
  joinPaths(paths, threshold = 0.01, active_path_index = 0, iteration = 0) {

    let debug = false;

    // Bail if iterations exceeded
    iteration++;
    if (debug) { console.log('---------------------'); }
    if (debug) { console.log('Iteration:', iteration); }

    let path_index = active_path_index;
    let distance;

    // Check for completion of multiple closed loops
    for (let i = path_index; i < paths.length; i++) {
      let path_closed = false;
      if (debug) { console.log('path_index:', path_index); }

      // Calculate distance between first and last point of target path
      distance = this.distance(paths[path_index][0], paths[path_index][paths[path_index].length-1]);

      // If distance is below threshold, then the path should be considered a closed loop
      if (distance < threshold) {
        path_closed = true;
      }

      // If the path is a closed loop, then increment the index to look at the next path
      // as the target path
      if (path_closed) {
        if (debug) { console.log('Path ' + path_index + ' closed.'); }
        path_index++;
        if (debug) { console.log('New Path Index: ' + path_index); }
        continue;
      }
      break;
    }

    if (debug) { console.log('selected path_index:', path_index); }
    if (debug) { console.log('paths.length:', paths.length); }

    // Exit function if the last path is closed
    if (path_index == paths.length) {
      return paths;
    }

    // Last point of the target path on which to join other paths
    let last_point = paths[path_index][paths[path_index].length - 1];

    // Check remaining paths
    // console.log('paths.length', paths.length)
    let overlap_count = 0;
    for (let i = 0; i < paths.length; i++) {

      // Skip self
      if (i == path_index) {
        continue;
      }

      // Check last point of target path against first point of other paths
      distance = this.distance(last_point, paths[i][0]);

      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance, paths[i]);
        overlap_count++;
        // console.log('before:', paths[0])
        paths[path_index] = paths[path_index].concat(paths[i].slice(1));
        // console.log('after:', paths[0])

        // remove from paths
        paths.splice(i, 1);
        break;
      }

      // Check last point of target path against last point of other paths
      distance = this.distance(last_point, paths[i][paths[i].length-1]);
      if (distance < threshold) {
        // console.log(last_point, paths[i][0], distance);
        overlap_count++;
        paths[path_index] = paths[path_index].concat(paths[i].reverse().slice(1));

        // remove from paths
        paths.splice(i, 1);
        break;
      }

      // Check first point of target path against first point of other paths
      distance = this.distance(paths[path_index][0], paths[i][0]);
      if (distance < threshold) {
        overlap_count++;
        paths[path_index] = paths[i].reverse().concat(paths[path_index]);
        paths.splice(i, 1);
        break;
      }

      // Check first point of target path against last point of other paths
      distance = this.distance(paths[path_index][0], paths[i][paths[i].length-1]);
      if (distance < threshold) {
        overlap_count++;
        paths[path_index] = paths[i].concat(paths[path_index]);
        paths.splice(i, 1);
        break;
      }

    }

    if (debug) { console.log("Overlap Count", overlap_count); }

    // Exit function if the last path is closed
    if (path_index == paths.length) {
      return paths;
    }

    // If the target path is closed or on the border go to next path
    if (overlap_count === 0) {
      active_path_index++;
    }

    paths = this.joinPaths(paths, threshold, active_path_index, iteration);

    // Remove consecutive duplicate points (within a threshold of distance)
    paths[0] = this.cleanPath(paths[0], 0.0001);

    return paths;
  }

  /**
   * Remove duplicate (coincident) consecutive points in a path
   * @param {array} path - A Path array
   * @param {number} [threshold=0.0001] - The threshold below which 2 points should
   * be considered coincident
   * @returns {array} A Path array
   */
  cleanPath(path, threshold = 0.0001) {

    let cleanedPath = [];

    // Copy first position of "path" to the filtered path
    cleanedPath.push(path[0]);

    // Subsequent positions must greater than the minimum distance to be added
    let self = this;
    path.forEach(function(point, index) {
      var last_point = cleanedPath[cleanedPath.length - 1];
      var step_distance = self.distance(point, last_point);
      if (step_distance > threshold) {
        cleanedPath.push(point);
      }
    });

    return cleanedPath;
  }

  /**
   * Sort Paths by start point from left to right, top to bottom
   * @param {array} paths - An array of Path arrays
   * @returns {array} - An array of Path arrays
   **/
  sortPaths(paths) {

    // Sort by Horizontal X position
    paths = paths.sort(function(a, b){
      return a[0][0] - b[0][0];
    });

    // Sort by Vertical Y position
    paths = paths.sort(function(a, b){
      return a[0][1] - b[0][1];
    });

    return paths;
  }

  /**
   * Shuffle Paths using the Fisher-Yates algorithm
   * From https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
   * @param {array} paths - An array of Path arrays
   * @returns {array} - An array of Path arrays
   */
  shufflePaths(paths) {
    for (let i = paths.length - 1; i > 0; i--) {
      const j = Math.floor(this.getRandom(0, 1, this.prng) * (i + 1));
      const temp = paths[i];
      paths[i] = paths[j];
      paths[j] = temp;
    }
    return paths;
  }

  /**
   * Remove any path shorter than the threshold length
   * @param {array} paths - An array of Paths.
   * @param {number} [threshold=0.01] - The distance below which
   * a path should be removed from the input paths.
   * @returns {array} - An array of Path arrays
   **/
  removeShortPaths(paths, threshold = 0.01) {
    let self = this;
    return paths.filter(function(path) {
      if (self.pathLength(path) >= threshold) {
        return true;
      }
      return false;
    });
  }

  /**
   * Simplify a path by removing points that do not significantly alter
   * the path's shape
   * @param {array} path - A Path array
   * @param {number} [distance_threshold=1.0] - The threshold below which 2 points should
   * be considered coincident. If the distance between the previously accepted point
   * and the point under evaluation is less than or equal to this value it will be
   * not be added to the new path.
   * @param {number} [direction_threshold=Math.PI/4] - If the change in direction between the
   * previously accepted segment and the segment under evaluation is greater than
   * this value (in Radians) then it will be added to the new path.
   * @returns {array} A Path array
   */
  simplify(path, distance_threshold = 1.0, direction_threshold = Math.PI / 4) {

    var simplified = [];

    // Copy first position of "path" to the filtered path
    simplified.push(path[0], path[1]);

    let last_direction = Math.atan2(path[1][1] - path[0][1], path[1][0] - path[0][0]);

    // Subsequent positions must be greater than the minimum distance to be added
    for (let i = 1; i < path.length-1; i++) {

      var magnitude = this.distance(simplified[simplified.length - 1], path[i+1]);

      let direction = Math.atan2(path[i+1][1] - path[i][1], path[i+1][0] - path[i][0]);
      let direction_delta = last_direction - direction;

      if (Math.abs(direction_delta) > direction_threshold) {
        last_direction = direction;
        simplified.push(path[i+1]);
      } else if (magnitude > distance_threshold) {
        last_direction = direction;
        simplified.push(path[i+1]);
      }
    }

    return simplified;
  }

  /**
   * Combine points within a threhold distance of each other into a Path
   * @param {array} points - An array of Points
   * @param {number} threshold - A maximum value for the distance between
   * two points where they can be considered as part of the same path.
   * @returns {array} An array of Paths
   **/
  pointsToPaths2(points, threshold) {
    const paths = [];

    let new_path = [];
    while (points.length > 1) {

      // New paths starts with next unprocessed point
      if (new_path.length === 0) {
        new_path.push(points.shift());
      }

      // Loop through all points and identify candidate points within
      // the distance threshold
      let distance;
      let candidates = [];
      for (let p = 0; p < points.length; p++) {

        let active_path_last_point_index = new_path.length - 1;
        distance = this.distance(
          new_path[active_path_last_point_index],
          points[p]
        );

        if (distance < threshold) {
          candidates.push({
            "point" : p,
            "distance" : distance
          });
        }
      }

      // No points near enough? We got us a path; move on.
      if (candidates.length === 0) {

        paths.push(new_path);
        new_path = [];

        continue;
      }

      // If we're here, we got candidates
      // Sort points by distance, favor by index if distances are equal
      candidates.sort(
        (a, b) => (a.distance > b.distance) ? 1 : (a.distance === b.distance) ? ((a.point > b.point) ? 1 : -1) : -1
      );

      // Add the nearest point as the next point in the path
      let nearest_point_index = candidates[0].point;
      let nearest_point = points[nearest_point_index];
      new_path.push(nearest_point);

      // Remove the point from available points
      points.splice(nearest_point_index, 1);
    }

    // We might be left with a non-empty path
    if (new_path.length > 0) {
      paths.push(new_path);
    }

    return paths;
  }

  /**
   * Combine points within a threhold distance of each other into a Path
   * This is a recursive solution that is known to cause a stack overflow.
   * Consider using pointsToPaths2 instead.
   * @param {array} paths - An array of Paths. This will grow in size during
   * each recursion
   * @param {array} points - An array of Points. This will reduce in size
   * during each recursion
   * @param {number} active_path_index - This points to the array index of
   * the `paths` parameter that is actively being evaluated
   * @param {number} threshold - A maximum value for the distance between
   * two points where they can be considered as part of the same path.
   * @returns {array} An array of Paths
   **/
  pointsToPaths(paths, points, active_path_index = 0, threshold = 0.001) {

    // Escape recursion (Chrome is having a "Maximum call stack size exceeded" error)
    // here where Safari and Firefox are not
    if (points.length === 0) {
      return paths;
    }

    // Loop through all points and identify candidate points within
    // the distance threshold
    let distance;
    let candidates = [];
    for (let p = 0; p < points.length; p++) {

      let active_path_last_point_index = paths[active_path_index].length - 1;
      distance = this.distance(
        paths[active_path_index][active_path_last_point_index],
        points[p]
      );

      if (distance < threshold) {
        candidates.push({
          "point" : p,
          "distance" : distance
        });
      }
    }

    if (candidates.length > 0) {

      // Sort points by distance, favor by index if distances are equal
      // https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      candidates.sort(
        (a, b) => (a.distance > b.distance) ? 1 : (a.distance === b.distance) ? ((a.point > b.point) ? 1 : -1) : -1
      );

      // Add the nearest point as the next point in the path
      let nearest_point_index = candidates[0].point;
      let nearest_point = points[nearest_point_index];
      paths[active_path_index].push(nearest_point);

      // Remove the point from available points
      points.splice(nearest_point_index, 1);

    } else {

      // If no points are within the threshold then start a new path
      paths.push([
        points.shift()
      ]);
      active_path_index++;
    }

    paths = this.pointsToPaths(paths, points, active_path_index, threshold);

    return paths;
  }

  /**
   * Crop multiple paths to a bounding shape
   * @param {array} candidate_paths - The candidate paths to be cropped
   * @param {array} cropShape - The bounding shape to be applied to
   * the candidate paths
   * @param {number} [threshold=0.0001] - The threshold at which to consider
   * a path as intersecting with another.
   * @returns {array} - A multidimensional array of paths
   */
  cropToShape(candidate_paths, cropShape, threshold = 0.0001) {

    let paths = [];
    let path = [];

    // Reformat vertices of cropShape for use with pointInPolygon()
    let vertices = this.#formatVertices(cropShape);

    // Loop through all paths
    for (let i = 0; i < candidate_paths.length; i++) {

      path = [];

      // Loop through points/segments of path
      for (let p = 0; p < candidate_paths[i].length-1; p++) {

        // Check if point is within bounds
        let point_in_bounds = this.pointInPolygon(
          vertices,
          candidate_paths[i][p][0],
          candidate_paths[i][p][1],
          threshold
        );

        // Check if next point is within bounds (if not the last point)
        let next_point_in_bounds = null;
        if (p+1 < candidate_paths[i].length) {
          next_point_in_bounds = this.pointInPolygon(
            vertices,
            candidate_paths[i][p+1][0],
            candidate_paths[i][p+1][1],
            threshold
          );
        }

        // Determine if the next point is the end of the candiate path
        let next_point_is_last = false;
        if (p === candidate_paths[i].length-2) {
          next_point_is_last = true;
        }

        if (point_in_bounds) {

          if (next_point_in_bounds) {

            // The next point is also inside the bounds so no need to calculate an intersection
            path.push(candidate_paths[i][p]);

            if (next_point_is_last) {
              path.push(candidate_paths[i][p+1]);
            }

          } else {

            // The next point is not inside the bounds so the point at which the segment crosses the border
            // must be calculated

            // Determine which side the next point intersects with. Stop testing after the first
            // is found.
            for (let pt = 0; pt < cropShape.length; pt++) {

              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              // Note: Could/Should this use this.pointEquals() instead?
              let on_line = this.pointOnLineSegment(
                candidate_paths[i][p],
                [cropShape[pt], cropShape[(pt+1) % cropShape.length]],
                0.011 // Math.abs(threshold)
              );

              if (on_line && intersection_point == false) {
                intersection_point = {
                  "x": candidate_paths[i][p][0],
                  "y": candidate_paths[i][p][1]
                };
              }

              // Add the intersection point to the path if one is found
              if (intersection_point !== false) {
                path.push(
                  candidate_paths[i][p],
                  [intersection_point.x, intersection_point.y]
                );

                // Save path if it contains at least one line segment (2 points)
                if (path.length >= 2) {
                  paths.push(path);
                }

                // Reset the path since the path hit the border
                path = [];

                // Break the for-loop. No need to calculate any other intersections
                break;
              }
            }
          }
        } else {

          // The current point is out of bounds

          if (next_point_in_bounds) {

            // The next point is inside the bounds so the point at which the segment crosses the border
            // must be calculated

            // Determine which side the next point intersects with. Stop testing after the first
            // is found.
            for (let pt = 0; pt < cropShape.length; pt++) {

              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              // Note: Could/Should this use this.pointEquals() instead?
              let on_line = this.pointOnLineSegment(
                candidate_paths[i][p],
                [cropShape[pt], cropShape[(pt+1) % cropShape.length]],
                Math.abs(threshold)
              );

              if (on_line) {
                intersection_point = {
                  "x": candidate_paths[i][p][0],
                  "y": candidate_paths[i][p][1]
                };
              }

              if (intersection_point !== false) {
                path.push(
                  [intersection_point.x, intersection_point.y],
                  candidate_paths[i][p+1]
                );
                break;
              }
            }
          } else {

            /*
              The start and end points are out of bounds, however it is
              possible that the line could cut across the crop shape.
            */

            // Test if the segment crosses any of the crop borders
            let intersections = [];
            for (let pt = 0; pt < cropShape.length; pt++) {

              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              if (intersection_point !== false) {
                intersections.push(intersection_point);
              }
            }

            if (intersections.length > 0) {

              // Sort by X-position to determine order of intersection
              intersections.sort(
                (a, b) => (a.x > b.x) ? 1 : -1
              );

              // Add the intersection points
              let j_max = Math.floor(intersections.length / 2);
              for (let j = 0; j < j_max; j++) {
                paths.push([
                  [intersections[j*2].x, intersections[j*2].y],
                  [intersections[j*2 + 1].x, intersections[j*2 + 1].y]
                ]);
              }
            }
          }
        }
      }

      // Save path if it contains at least one line segment (2 points)
      if (path.length >= 2) {
        paths.push(path);
      }
    }

    return paths;
  }

  /**
   * Take a path and crop it to a circle
   * This works, but hasn't been rigorously tested on edge cases
   * @deprecated Try cropToShape() instead
   * @param {array} candidate_paths - An array of Paths to be cropped
   * @param {array} [center=[0,0]] - The center of the cropping circle
   * @param {array} [crop_radius=1] - The radius of the cropping circle
   * @returns {array} - An array of Paths
   */
  cropToCircle(candidate_paths, center = [0,0], crop_radius = 1) {

    let paths = [];

    let path = [];

    for (let i = 0; i < candidate_paths.length; i++) {

      // Loop through points/segments of path
      for (let p = 0; p < candidate_paths[i].length; p++) {

        // Calculate distance of point from center
        let d1 = this.distance([0,0], candidate_paths[i][p]);

        // Calculate distance from next point (if it exists) to the center
        let d2 = null;
        if (p+1 < candidate_paths[i].length) {
          d2 = this.distance([0,0], candidate_paths[i][p+1]);
        }

        if (d1 < crop_radius) {

          // Point is inside circle

          // Check if next point (if there is one) is outside the circle.
          if (d2 !== null && d2 > crop_radius) {

            // The point is outside of the crop circle, so calculate its point of intersection
            let intersections = this.lineCircleIntersect(
              candidate_paths[i][p],
              candidate_paths[i][p+1],
              [[0,0], crop_radius]
            );

            // Assuming these are short line segments
            // there should only be one point of intersection.
            // Add it to the path
            if (intersections.length == 1) {
              path.push(intersections[0]);
            }

            // End active path and re-initialize
            paths.push(path);
            path = [];

          } else {

            // The next point is also inside the circle so no need to calculate an intersection
            path.push(candidate_paths[i][p]);

            // End active path and start a new one if it's the last point
            if (d2 === null) {
              paths.push(path);
              path = [];
            }

          }
        } else if ((d1 > crop_radius) && (d2 !== null && d2 < crop_radius)) {

          // The point is outside the circle, but the next point is in, so calculate
          // the point of intersection.
          let intersections = this.lineCircleIntersect(
            candidate_paths[i][p],
            candidate_paths[i][p+1],
            [[0,0], crop_radius]
          );

          // Assuming these are short line segments
          // there should only be one point of intersection.
          // Add it to the path
          if (intersections.length == 1) {
            path.push(intersections[0]);
          }

          // End active path and start a new one if there are at least 2 points to define a line
          // if (path.length >= 2) {
          //   paths.push(path);
          //   path = [];
          // }
        }
      }
    }

    // Save path if it contains at least one line segment (2 points)
    if (path.length >= 2) {
      paths.push(path);
    }

    return paths;
  }

  /**
   * Take a path and crop it to a rectangle
   * This works, but hasn't been rigorously tested on edge cases.
   * For example, if there are 2 consecutive points that are both
   * outside of the crop area, but cut across the region, the segment
   * of the path that cuts across will not be determined or used.
   * Note: This has not been performance optimized.
   * @deprecated Try cropToShape() instead
   * @param {array} candidate_paths - The candidate paths to be cropped
   * @param {number} x_min - The minimum X value to be included (inclusive)
   * @param {number} x_max - The maximum X value to be included (inclusive)
   * @param {number} y_min - The minimum Y value to be included (inclusive)
   * @param {number} y_max - The maximum Y value to be included (inclusive)
   * @returns {array} - An array of Paths
   */
  cropToRectangle(candidate_paths, x_min, x_max, y_min, y_max) {

    let paths = [];

    let path = [];

    // Define the crop shape using the function input
    let cropShape = [
      [x_min, y_min],
      [x_max, y_min],
      [x_max, y_max],
      [x_min, y_max]
    ];

    // Loop through all paths
    for (let i = 0; i < candidate_paths.length; i++) {

      path = [];

      // Loop through points/segments of path
      for (let p = 0; p < candidate_paths[i].length-1; p++) {

        // Check if point is within bounds
        let point_in_bounds = (candidate_paths[i][p][0] >= x_min && candidate_paths[i][p][0] <= x_max)
          && (candidate_paths[i][p][1] >= y_min && candidate_paths[i][p][1] <= y_max);

        // Check if next point is within bounds (if not the last point)
        let next_point_in_bounds = null;
        if (p+1 < candidate_paths[i].length) {
          next_point_in_bounds = (candidate_paths[i][p+1][0] > x_min && candidate_paths[i][p+1][0] < x_max)
            && (candidate_paths[i][p+1][1] > y_min && candidate_paths[i][p+1][1] < y_max);
        }

        // Determine if the next point is the end of the candiate path
        let next_point_is_last = false;
        if (p === candidate_paths[i].length-2) {
          next_point_is_last = true;
        }

        if (point_in_bounds) {

          if (next_point_in_bounds) {

            // The next point is also inside the bounds so no need to calculate an intersection
            path.push(candidate_paths[i][p]);

            if (next_point_is_last) {
              path.push(candidate_paths[i][p+1]);
            }

          } else {

            // The next point is not inside the bounds so the point at which the segment crosses the border
            // must be calculated

            // Determine which side the next point intersects with. Stop testing after the first
            // is found.
            for (let pt = 0; pt < cropShape.length; pt++) {
              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              // Add the intersection point to the path if one is found
              if (intersection_point !== false) {
                path.push(
                  candidate_paths[i][p],
                  [intersection_point.x, intersection_point.y]
                );

                // Save path if it contains at least one line segment (2 points)
                if (path.length >= 2) {
                  paths.push(path);
                }

                // Reset the path since the path hit the border
                path = [];

                // Break the for-loop. No need to calculate any other intersections
                break;
              }
            }
          }
        } else {

          // The current point is out of bounds

          if (next_point_in_bounds) {

            // The next point is inside the bounds so the point at which the segment crosses the border
            // must be calculated

            // Determine which side the next point intersects with. Stop testing after the first
            // is found.
            for (let pt = 0; pt < cropShape.length; pt++) {
              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              if (intersection_point !== false) {
                path.push(
                  [intersection_point.x, intersection_point.y],
                  candidate_paths[i][p+1]
                );
                break;
              }
            }
          } else {

            // Test if the segment crosses any of the crop borders
            for (let pt = 0; pt < cropShape.length; pt++) {

              let intersection_point = this.getLineLineCollision(
                {"x": candidate_paths[i][p][0], "y": candidate_paths[i][p][1]},
                {"x": candidate_paths[i][p+1][0], "y": candidate_paths[i][p+1][1]},
                {"x": cropShape[pt][0], "y": cropShape[pt][1]},
                {"x": cropShape[(pt+1) % cropShape.length][0], "y": cropShape[(pt+1) % cropShape.length][1]}
              );

              // Add the intersection point to the path if one is found
              if (intersection_point !== false) {
                path.push([intersection_point.x, intersection_point.y]);
              }
            }

          }
        }
      }

      // Save path if it contains at least one line segment (2 points)
      if (path.length >= 2) {
        paths.push(path);
      }
    }
    return paths;
  }

  /**
   * Remove portions of paths that are inside of the knockout shape
   * This may also be considered a Boolean Exclusive Or (XOR)
   * @param {array} paths - An array of Path arrays
   * @param {array} shape - A Path array definiting a closed shape
   * @returns {array} - An array of Path arrays
   **/
  knockout(paths, shape) {

    let new_paths = [];

    // Loop through paths
    for (let i = 0; i < paths.length; i++) {

      // Get intersections
      let new_path = this.shapeIntersections(paths[i], shape);

      // Remove segments of the path (new_path) that are inside of the shape
      let knocked_paths = this.booleanSubtractComparison(new_path, shape, false);

      // Add to new paths
      new_paths = new_paths.concat(knocked_paths);
    }

    return new_paths;
  }

  /**
   * Fill a convex shape (polygon) with straight lines
   * @param {array} shape - The shape to be filled
   * @param {number} spacing - The space between the fill lines
   * @param {number} angle - The angle (in radians) of the fill lines (0.0 is horizontal)
   * @param {boolean} alternate - Set whether the lines should alternate directions (optimal for plotting)
   * @param {boolean} connect - Set to true to connect the lines. Default is false
   * @param {function} fillFunc - An optional function to describe how to space fill lines
   * @returns {array} - An array of Path arrays
   */
  fill(shape, spacing, angle = 0.0, alternate = true, connect = false, fillFunc = null) {

    // Calculate the tight bounding box of the shape
    let bbox = this.boundingBox(shape);

    // Calculate the center of that bounding box
    let bbox_center = [
      bbox[0][0] + (bbox[0][1] - bbox[0][0])/2,
      bbox[1][0] + (bbox[1][1] - bbox[1][0])/2,
    ];

    // Calculate the diagonal/radius distance of the bounding box
    // in order to know the maximum radius of the shape so that it
    // can be covered by any angle of lines
    let radius = this.distance(
      [bbox[0][0], bbox[1][0]],
      [bbox[0][1], bbox[1][1]]
    );

    // Construct the fill lines
    let num_lines = radius / spacing;
    let lines = [];
    for (let j = 0; j < num_lines; j++) {

      // Calculate the vertical position of the fill line
      // The default uses even spacing. A fill function
      // can be passed in to define the line spacing
      let y = -radius/2 + radius * (j/num_lines);
      if (typeof fillFunc == "function") {
        y = fillFunc(j/num_lines);
      }

      // Create a fill line
      let line = [
        [-radius, y],
        [ radius, y]
      ];

      // Rotate the line to match the requested fill angle
      if (angle !== 0) {
        line = this.rotatePath(line, angle);
      }

      // Move from the origin to the shape's position
      line = this.translatePath(line, bbox_center);

      lines.push(line);
    }

    // Apply the fill lines to the shape
    let fill = [];
    for (let i = 0; i < lines.length; i++) {

      // Start point of fill line
      let p1 = lines[i][0];

      // End point of fill line
      let p2 = lines[i][1];

      // Calculate intersection with shape
      let intersections = [];
      for (let a = 0; a < shape.length; a++) {

        // Define side of shape - points a and b
        let b = a + 1;
        if (b >= shape.length) {
          b = b % shape.length;
        }

        // Calculate intersection
        let intersection = this.getLineLineCollision(
          {"x": p1[0], "y": p1[1]},
          {"x": p2[0], "y": p2[1]},
          {"x": shape[a][0], "y": shape[a][1]},
          {"x": shape[b][0], "y": shape[b][1]}
        );

        // Add to array of intersection points
        if (intersection !== false) {
          intersections.push(intersection);
        }
      }

      // Process intersections
      if (intersections.length > 0) {

        // Sort by X-position to determine order of intersection
        intersections.sort(
          (a, b) => (a.x > b.x) ? 1 : -1
        );

        // Alternate line direction
        if (alternate && i % 2) {
          intersections = intersections.reverse();
        }

        for (let j = 0; j < intersections.length - 1; j++) {

          if (j % 2 === 1) {
            continue;
          }

          // Add line to results
          if (connect) {
            fill = fill.concat([
              [intersections[j].x, intersections[j].y],
              [intersections[j+1].x, intersections[j+1].y]
            ]);
          } else {
            fill.push([
              [intersections[j].x, intersections[j].y],
              [intersections[j+1].x, intersections[j+1].y]
            ]);
          }
        }

      }
    }

    // Force multi-dimensional array for connected lines
    // so that the return data types match
    if (connect) {
      fill = [fill];
    }

    return fill;
  }

  /**
   * Layer paths according to their stacking order
   * The lowest index (0) of "paths" will be on the bottom
   * of the stack. Subsequent paths (1, 2, 3...) will
   * knock out (subtract) any portions of previous paths
   * that they cover.
   *
   * Important: Shapes that are knocked-out do not include
   * the portion of the other shape that covers them. In
   * other words, the cover section is removed from the original
   * path and leaves a blank space, rather than incorporating
   * the portion of the other shape
   *
   * @param {array} paths - An array of path arrays
   * @param {boolean} [join=false] - Whether or not to join paths
   * @param {number} [offset=0] - This represents an offset from the original
   * path that can be used to adjust at what point an intersection
   * occurs.
   * @param {boolean} [continuous=false] - Set to true if the Paths are
   * quadrilaterals where each shares 1 side in succession. This
   * can be used to achieve an outlined path effect with overlaps
   * @param {boolean} [use_bbox=false] - Use a path's bounding box to test
   * intersection prior to testing every segment
   *
   * @returns {array} - An array of Path arrays
   **/
  layeredPaths(paths, join = false, offset = 0, continuous = false, use_bbox = false) {

    // Start performance timer
    const t0 = performance.now();

    // Final paths for plotting
    let final_paths = [];

    // Loop through shapes
    for (let i = 0; i < paths.length; i++) {

      // Initialize arrays used to store the whole
      // or segmented version of paths[i]
      let paths_of_i = [];

      // The last shape doesn't need to be evaluated since
      // it is on "top" of all other shapes
      if (i == paths.length-1) {

        // In "continuous" mode the final point/side of the
        // last shape should be removed
        if (continuous) {
          paths[i].pop();
        }

        final_paths.push(paths[i])
        break;
      }

      // Get all shapes on "layers" above the current shape
      let comparison_shapes = JSON.parse(JSON.stringify(paths))
      comparison_shapes.splice(0, i+1)

      // Expand Shape
      if (offset > 0) {
        let offset_paths = [];
        for (let c = 0; c < comparison_shapes.length; c++) {
          comparison_shapes[c] = this.offsetPath(comparison_shapes[c], offset);
        }
      }

      // Use path bounding boxes to rule out non-intersecting shapes
      let bbox_ignore_count = 0;
      if (use_bbox) {

        // Get bounding box of path under investigation
        const path_i_bbox = this.boundingBox(paths[i]);

        // Create a path from the bounding box
        let path_i_bbox_path = [
          [path_i_bbox[0][0], path_i_bbox[1][0]],
          [path_i_bbox[0][1], path_i_bbox[1][0]],
          [path_i_bbox[0][1], path_i_bbox[1][1]],
          [path_i_bbox[0][0], path_i_bbox[1][1]]
        ];
        path_i_bbox_path.push(path_i_bbox_path[0]);

        // Loop through paths to be compared
        let filtered_shapes = [];
        for (const comparison_shape of comparison_shapes) {

          const comparison_shape_bbox = this.boundingBox(comparison_shape);

          // Create a path from the bounding box
          const comparison_shape_bbox_path = [
            [comparison_shape_bbox[0][0], comparison_shape_bbox[1][0]],
            [comparison_shape_bbox[0][1], comparison_shape_bbox[1][0]],
            [comparison_shape_bbox[0][1], comparison_shape_bbox[1][1]],
            [comparison_shape_bbox[0][0], comparison_shape_bbox[1][1]]
          ];
          comparison_shape_bbox_path.push(comparison_shape_bbox_path[0]);

          // Test if the bounding box paths intersect
          const bbox_intersections = this.shapeIntersections(path_i_bbox_path, comparison_shape_bbox_path);

          // Use the comparison_shape if intersections have been detected
          if (bbox_intersections.length != path_i_bbox_path.length) {
            filtered_shapes.push(comparison_shape);
          } else {
            bbox_ignore_count++;
          }
        }

        // Replace the comparison_shapes from before the filtering with those identified during filtering
        comparison_shapes = filtered_shapes;

        // If there are no shapes to compare, then add the shape under analysis can be added
        // to the final output paths with no further analysis needed
        if (comparison_shapes.length == 0) {
          final_paths.push(paths[i]);
          continue;
        }
      }

      // Loop through sides of shape under evaluation
      for (let point = 0; point < paths[i].length-1; point++) {

        // In "continuous" mode, don't evaluate interior/equivalent
        // sides of adjacent quadrilaterals
        if (continuous && (point == 1 || (point == 3 && i > 0))) {
          continue;
        }

        // Initialize the segment as the full side of the path
        let new_segments = [
          [paths[i][point], paths[i][point+1]]
        ];

        // Split the path using any shapes that overlap it
        new_segments = this.linePathsSplit(
          [paths[i][point], paths[i][point+1]],
          comparison_shapes
        )

        // Add the side's segments to an array for the whole shape
        // This could be concatenated to final_paths directly, but
        // I like the idea of having one array for the whole shape
        if (new_segments.length > 0) {
          paths_of_i = paths_of_i.concat(new_segments);
        }
      }

      if (join) {
        paths_of_i = this.joinPaths(paths_of_i)
      }

      // Add the paths of the shape onto the final output paths
      final_paths = final_paths.concat(paths_of_i)
    }

    // Stop performance timer and display results
    const t1 = performance.now();

    // console.log('layeredPaths took ' + (t1 - t0).toFixed(1) +  ' milliseconds');

    return final_paths;
  }

  /**
   * Subtract paths from one another. The lowest index
   * The lowest index (0) of "paths" will be on the bottom
   * of the stack. Subsequent paths (1, 2, 3...) will
   * knock out (subtract) any portions of previous paths
   * that they cover.
   *
   * Important: This is very similar to layeredPaths, except
   * that this method incorporates the path of the shape that
   * is being subtracted from the original path (as opposed to
   * removing it as in layeredPaths).
   *
   * @param {array} paths - An array of path arrays
   *
   * @returns {array} - An array of path objects either labeled as "group"
   * if it contains more than one path or "path" if it contains a single
   * path. It is important to group pieces of the same original shape/path
   * together so that if a fill is applied later all pieces of the same original
   * shape can be filled the same.
   **/
  subtractPaths(paths) {

    // Final paths for plotting
    let final_paths = [];

    // Loop through shapes
    for (let i = 0; i < paths.length; i++) {

      // The last shape doesn't need to be evaluated since
      // it is on "top" of all other shapes
      if (i == paths.length-1) {
        // final_paths.push(paths[i])
        final_paths.push({
          "path": paths[i]
        });
        break;
      }

      // Get all shapes on "layers" above (higher index) the current shape
      let comparison_shapes = this.deepCopy(paths);
      comparison_shapes.splice(0, i+1);

      // Subtract these shapes from the current shape
      let new_shape = this.deepCopy(paths[i]);
      for (let j = 0; j < comparison_shapes.length; j++) {

        // Check if the new_shape has been completely
        // eliminated by other shape subtractions
        if (typeof new_shape == "undefined") {
          break;
        }

        // Subtract the comparision shape from the original shape
        new_shape = this.booleanSubtract(
          new_shape,
          comparison_shapes[j]
        );
      }

      // Add the paths of the shape onto the final output paths
      // final_paths = final_paths.concat(new_shape)
      if (new_shape.length > 1) {
        final_paths.push({
          "group": new_shape
        });
      } else {
        final_paths.push({
          "path": new_shape[0]
        });
      }
    }

    return final_paths;
  }

  /**
   * Take a line segment and a path of a closed shape and return the portion of that
   * line that is not intersected by the shape
   *
   * INTENDED TO BE PRIVATE METHOD OF CLASS
   *
   * @param {array} line - An array containing 2 point Arrays that define the x/y position of the
   * line's start and end points
   * @param {array} path - An array containing 2 or more point Arrays defining a path.
   * @param {number} [threshold=0.001] - An optional threshold value for a distance below which two points
   * should be considered coincident and not intersecting.
   * @returns {array} - An array of zero, one or two line arrays
   **/
  linePathSplit(line, path, threshold = 0.001) {

    // Start and End points for line
    let a = line[0];
    let b = line[1];

    // Test if endpoints are inside the shape being tested against
    let vertices = this.#formatVertices(path);
    let point_a_inside = this.pointInPolygon(vertices, a[0], a[1]);
    let point_b_inside = this.pointInPolygon(vertices, b[0], b[1]);

    // If both points are inside shape then there is no line left
    if (point_a_inside && point_b_inside) {
      return [];
    }

    // Check all points of path
    let intersections = [];
    for (let i = 0; i < path.length-1; i++) {

      // Start and end points for path
      let c = path[i];
      let d = path[i+1];

      // Detect if line segment a->b intersects with segment c->d
      let intersect = this.getLineLineCollision(
        {x: a[0], y: a[1]},
        {x: b[0], y: b[1]},
        {x: c[0], y: c[1]},
        {x: d[0], y: d[1]}
      )

      // Save found intersections to an array of intersections
      // to be further evaluated
      if (intersect != false) {
        intersections.push([intersect.x, intersect.y]);
      }
    }

    // Evaluate intersection(s)
    // A convex polygon can only intersect 0, 1 or 2 times
    if (intersections.length == 0) {

      // If no intersections were found return the originl input line
      return [
        [a, b]
      ];
    } else if (intersections.length == 1 && point_a_inside) {

      // Point A is inside the target shape
      return [
        [intersections[0], b]
      ];
    } else if (intersections.length == 1 && point_b_inside) {

      // Point B is inside the target shape
      return [
        [a, intersections[0]]
      ];
    } else if (intersections.length == 1) {

      // This situation arises if the point is very near a line
      // on the path, most likely due to a previous evaluation of
      // the line and path where the line was previously split
      // into two segments.

      // Find greatest distance from an endpoint to the intersection
      let dist1 = this.distance(a, intersections[0])
      let dist2 = this.distance(intersections[0], b)

      if (dist1 > dist2) {
        return [
          [a, intersections[0]]
        ];
      } else {
        return [
          [intersections[0], b]
        ];
      }

    } else if (intersections.length == 2) {

      // Determine which intersection matches with which intersection to
      // split the line into two non-overlapping segments
      let dist1 = this.distance(a, intersections[0])
      let dist2 = this.distance(a, intersections[1])
      if (dist1 < threshold && dist2 < threshold) {
        return [
          [a,b]
        ];
      } else if (dist1 < dist2) {
        return [
          [a, intersections[0]],
          [intersections[1], b]
        ];
      } else {
        return [
          [a, intersections[1]],
          [intersections[0], b]
        ];
      }
    }
    return [];
  }

  /**
   * Take a line segment and multiple paths representing a closed convex polygon
   * and return the portion of that line that is not intersected by any of the shapes (paths)
   *
   * INTENDED TO BE PRIVATE METHOD OF CLASS
   *
   * @param {array} line - An array containing 2 point Arrays that define the x/y position of the
   * line's start and end points
   * @param {array} paths - An array of paths. Each path should represent a closed convex
   * shape.
   * @returns {array} - An array of zero, one or two lines that represent the portion of the
   * input line that do not intersect with or are not covered by any of the input paths
   **/
  linePathsSplit(line, paths) {

    let segments = [];

    // Loop through all of the paths
    for (let i = 0; i < paths.length; i++) {

      // Calculate the intersection(s) between the line
      // and the current path. This will produce 0, 1 or 2
      // intersections for convex polygons
      try {
        segments = this.linePathSplit(line, paths[i])
      } catch(e) {
        console.log(e);
        return segments;
      }

      // Initialize an empty array to store subsegments of the
      // segments.
      let sub_segments = [];

      if (typeof segments === "undefined") {
        console.log("segments is undefined");
        continue;
      }

      if (segments.length > 1) {

        // If there are two segments (max for a convex polygon "path")
        // then they should each be evaluated against the other paths.
        // This is where the recursive magic happens.
        for (let j = 0; j < segments.length; j++) {
          sub_segments = sub_segments.concat(
            this.linePathsSplit(segments[j], paths)
          );
        }

        return sub_segments;

      } else if (segments.length == 1) {

        // If there was one intersection, creating a truncated line,
        // which should become the new line to be evaluated against
        // the rest of the "paths"
        line = segments[0];

      } else {

        // If segments is empty then the endpoints were completely
        // contained within a shape (overlapped and hidden from view)
        return segments
      }
    }

    return segments;
  }

  /**
   * Project a shadow from a closed-path shape.
   * Note: This has only been verified for regular convex polygons
   * Keyword: sciography
   * @param {array} path - An array containing 3 or more point Arrays defining a closed path.
   * @param {array} translation - An array of an x and y coordinate that defines the direction
   * the shadow will fall
   * @returns {object} An object with attributes "perimeter" and "lines". The perimeter represents
   * the entirety of the shadowed shape - including the input shape itself. "shadow" contains the
   * outline of the shape with the input path removed. "lines" contains the projection
   * lines used during analysis and is useful for visual debugging.
   **/
  projectShapeShadow(path, translation) {

    // Translate the input path
    let path_B = this.translatePath(path, translation);

    let projections = [];
    let perimeter = [];

    // Reformat vertices for use with pointInPolygon()
    let vertices = this.#formatVertices(path);

    // Set a flag for tracking whether the previous point of the input
    // shape was in shadow or not
    let occluded = false;

    // This uses the loop label so that multiple loops may be navigated
    loop1:
    for (let i = 0; i < path.length - 0; i++) {

      // Define a projection line that goes from the point of interest (path[i])
      // to a point at the end of the translation vector
      let line = [
        path[i],
        [
          path[i][0] + translation[0],
          path[i][1] + translation[1]
        ]
      ];

      // If the line's endpoint is inside path then no need to check
      // for segment intersections. Add the path point to the perimeter
      // A very small threshold is required to prevent visual errors
      if (this.pointInPolygon(vertices, line[1][0], line[1][1], -0.00000001)) {

        // If the "occluded" flag hasn't been set yet, then
        // this is the first occlusion so the previous point
        // needs to be added
        if (!occluded) {
          if (typeof path[i-1] !== 'undefined') {
            perimeter.push(path[i-1]);
          }
        }

        // Add current point
        perimeter.push(path[i]);

        // Set the "occluded" flag
        occluded = true;

        // Continue on to analyze next point of "i" loop
        continue;
      }

      // Make a copy of the input path for analysis
      // Remove the last point since it is the same as the
      // first point in a closed path
      let test_path = this.deepCopy(path);
      test_path.pop();

      // Analyze the current point of interest (point[i])
      // against all points in the same path except the points
      // directly proceeding it and following it, which
      // will by their nature have coincident points
      loop2:
      for (let j = 0; j < test_path.length - 2; j++) {

        // Identify the next segment to analyze. Use the
        // modulos operator to loop around a closed path
        let index_1 = (i+j+1) % (test_path.length);
        let index_2 = (i+j+2) % (test_path.length);
        let segment = [
          test_path[index_1],
          test_path[index_2]
        ];

        // Test for intersection
        let intersection = this.getLineLineCollision(
          {"x": segment[0][0], "y": segment[0][1]},
          {"x": segment[1][0], "y": segment[1][1]},
          {"x": line[0][0], "y": line[0][1]},
          {"x": line[1][0], "y": line[1][1]}
        );

        // If there is no intersection then the point is in shadow
        if (intersection !== false) {

          // If the "occluded" flag hasn't been set yet, then
          // this is the first occlusion so the previous point
          // needs to be added
          if (!occluded) {
            if (typeof path[i-1] !== 'undefined') {
              perimeter.push(path[i-1]);
            }
          }

          // Always add current point
          perimeter.push(path[i]);

          // Set the "occluded" flag
          occluded = true;

          // For a closed regular, convex polygon, only one intersection
          // can happen, so continue to next point of "i" loop
          continue loop1;
        }
      }

      // Add the last point if going from occluded to non-occluded
      if (occluded) {
        perimeter.push(path[i]);
      }

      // Add projected endpoint
      perimeter.push(line[1]);

      // Reset flag
      occluded = false;

      // This will only be reached if there were no intersections
      projections.push(line);
    }

    // Remove the part of the shadow perimeter that is "under" the input shape
    // to isolate the visible shadow
    let shadow = this.booleanSubtract(perimeter, path)[0];

    return {
      "perimeter": perimeter,
      "shadow": shadow,
      "lines": projections
    }
  }

  /*************************************/
  // Effects
  /*************************************/

  /**
   * Add a "jot" or small mark near the end of the path
   * @param {array} path - A Path Array
   * @param {number} offset - The distance of the jot from the end of the path
   * @param {number} length - The length of the jot line
   * @param {number} rotation - The angle in radians that the jot may rotate in
   * either a positive or negative direction (i.e. rotation range is twice this value)
   * @return {array} A Path Array
   **/
  jot(path, offset, length, rotation = 0) {

    // Ensure path is long enough
    if (path.length < 2) {
      throw "Path must have 2 or more points."
    }

    // Get direction of last segment
    let angle = Math.atan2(
      path[path.length - 1][1] - path[path.length - 2][1],
      path[path.length - 1][0] - path[path.length - 2][0]
    );

    // Create the jot path
    let jot = [
      [
        offset * Math.cos(angle),
        offset * Math.sin(angle)
      ],
      [
        (offset + length) * Math.cos(angle),
        (offset + length) * Math.sin(angle)
      ]
    ];

    // Rotate
    if (rotation > 0) {
      jot = this.rotatePath(jot, this.getRandom(-rotation, rotation));
    }

    // Move to end of path
    jot = this.translatePath(jot, path[path.length - 1]);

    return jot;
  }

  /*************************************/
  // Private Class Methods
  /*************************************/

  /**
   * Convert data for usage in PathHelp.pointInPolygon
   * @param {array} path - A Path array
   * @returns {array} An Array of the same points formatted as an object (i.e. {x: 0, y: 0})
   **/
  #formatVertices(path) {
    let vertices = [];
    for (let v = 0; v < path.length-1; v++) {
      vertices.push({x: path[v][0], y: path[v][1]});
    }
    return vertices;
  }
}

// Add module support for CommonJS format in Node (via `require`)
if (typeof exports === "object") {
  module.exports = PathHelper;
}
export default PathHelper;