/** Class representing a Theta-Rho Sisyphus track */
class thetaRho {

  constructor() {

    this.header = [
      "# Created using https://markroland.github.io/sand-table-pattern-maker/",
      "# Version " + app_version,
      "#",
      "# Track Created: " + month() + "/" + day() + "/" + year() + " " + hour() + ":" + minute() + ":" + second(),
      "#",
      "# Written by Mark Roland",
      ""
    ];

    this.preamble = [
      "#",
      "# Custom Theta-Rho to execute before the start of the track",
      "#",
      // Insert your code here
    ];

    this.postamble = [
      "#",
      "# Custom Theta-Rho to execute after the end of the sketch",
      "#",
      // Insert your code here
    ];
  }

  /**
   * Create the Theta-Rho track file used by Sisyphus tables
   *
   * https://sisyphus-industries.com/community/community-tracks/new-tool-for-creating-simple-algorithmic-tracks/#post-296
   *
  */
  convert(path) {

    // Initialize variables
    var theta;
    var current_theta;
    var previous_theta;
    var previous_theta_offset;
    var delta_theta;

    var rho;
    var current_rho;
    var previous_rho;
    var previous_rho_offset;

    var theta_offset = 0;

    var theta_direction;

    var sub_steps = new Array();

    // Rotate the path by a quarter revolution
    // Should rotation be negative?
    path = this.ThrRotatePath(path, Math.PI/2);

    // Flip on the X axis
    path = this.ThrScalePath(path, [-1, 1]);

    // Set the maximum radius supported by the plotter.
    // This is limited by the shortest axis
    var max_radius = Math.min((max_x - min_x),(max_y - min_y)) / 2;

    // Initialize thetaRho command string with the standard header
    var thetaRho = this.header;

    // Add standard start command(s)
    thetaRho = thetaRho.concat(this.preamble);

    // Subdivide Path.
    // The coefficient here is arbitrary so long as
    path = this.subdividePath(path, 0.125 * ball_size);

    // The first point is initialized so that when looping
    // through successive points the Theta value can be compared
    // to the previous Theta position.
    previous_theta = this.calcTheta(path[0][0], path[0][1]);
    thetaRho.push(
      previous_theta.toFixed(4)
      + " "
      + this.calcRho(path[0][0], path[0][1], max_radius).toFixed(4)
    );

    // Loop through the rest of the path coordinates
    for (i = 1; i < path.length; i++) {

      // Calculate current Theta from 0 to 2-Pi
      current_theta = this.calcTheta(path[i][0], path[i][1])

      // Add on the full rotations previously completed
      current_theta += Math.floor(previous_theta / (2 * Math.PI)) * (2 * Math.PI);

      // Compute the difference to the last point.
      delta_theta = current_theta - previous_theta;

      // Correct delta so that it takes the shortest path
      if (delta_theta < -Math.PI) {
        delta_theta += 2.0 * Math.PI;
      } else if (delta_theta > Math.PI) {
        delta_theta -= 2.0 * Math.PI;
      }

      // Add change in theta to previous theta position
      theta = previous_theta + delta_theta;

      // Save theta position as previous for next iteration
      previous_theta = theta;

      // Calculate Rho
      rho = this.calcRho(
        path[i][0],
        path[i][1],
        max_radius
      );

      // Save coordinates to path
      thetaRho.push(theta.toFixed(4) + " " + rho.toFixed(4));
    }

    // Add end command(s)
    thetaRho = thetaRho.concat(this.postamble);

    return thetaRho;
  }

  /**
   * Scale Path
   * path An array of [x,y] coordinates
   * scale An array of [x,y] scale factors
   **/
  ThrScalePath(path, scale) {
    return path.map(function(a){
      return [
        a[0] * scale[0],
        a[1] * scale[1]
      ];
    });
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  ThrRotatePath(path, theta) {
    return path.map(function(a){
      return [
        a[0] * Math.cos(theta) - a[1] * Math.sin(theta),
        a[0] * Math.sin(theta) + a[1] * Math.cos(theta)
      ]
    });
  }

  /**
   * Subdivide a path
   * path A path array
   * max_segment_length Smaller values create create a more detailed path
   * Return Array
   **/
  subdividePath(path, max_segment_length) {

    let new_path = new Array();
    let delta_x, delta_y;

    // Loop through path coordinates
    let i_max = path.length - 1;
    for (i = 0; i < i_max; i++) {

      // Calculate the distance between the current and next point
      delta_x = path[i+1][0] - path[i][0];
      delta_y = path[i+1][1] - path[i][1];
      let delta_distance = Math.sqrt(
        Math.pow(delta_x, 2)
        +
        Math.pow(delta_y, 2)
      );

      // Calculate the number of steps by which to divide the distance
      let num_substeps = Math.ceil(delta_distance/max_segment_length);

      // Add sub-step coordinates for each subdivision
      for (var j = 0; j < num_substeps; j++) {
        new_path.push([
          path[i][0] + delta_x * (j/num_substeps),
          path[i][1] + delta_y * (j/num_substeps)
        ]);
      }

      // Add last step
      if (i+1 == i_max) {
        new_path.push([
          path[i][0] + delta_x,
          path[i][1] + delta_y
        ]);
      }
    }

    // Add last coordinate
    new_path.concat(path.slice(-1));

    return new_path;
  }

  /**
   * Calculate the angle Theta ranging from 0 to two Pi
   * @param {number} x - The X Coordinate
   * @param {number} y - The Y Coordinate
   * Return {number} The polar angle, Theta, between [0,0] and [x,y]
   **/
  calcTheta(x, y) {

    // Calculator theta in a range from +Pi to -Pi
    let theta = Math.atan2(y, x);

    // Convert -pi-to-0 to pi-to-2pi
    if (theta < 0) {
      theta = (2 * Math.PI) + theta;
    }
    return theta;
  }

  /**
   * Calculate the radius Rho and normalize to a value between 0 and 1
   * @param {number} x - The X Coordinate
   * @param {number} y - The Y Coordinate
   * @param {number} max_radius - The maximum radius of the table
   * Return {number} The radius Rho, normalized between 0 and 1
   **/
  calcRho(x, y, max_radius) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / max_radius;
  }
}