class ThetaRho {

  constructor() {

    this.key = "thr";

    this.name = "Theta Rho Coordinates";

    this.config = {
      "thr": {
        "name": "Theta Rho",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 11,
            "cols": 30,
          },
          "value" : "# Start at Center\n0   0\n\n"
            + "# Spiral out 4 revolutions\n"
            + "25.13272 1\n\n"
            + "# Do one full circle at maximum radius\n"
            + "31.4159 1\n\n"
            + "# do 40 revs in\n"
            + "251.32.72  0\n",
          "params" : []
        }
      }
    };

    this.path = [];
  }

  setup() {
    return null;
  }

  draw() {

    // Update object
    this.config.thr.value = document.querySelector('#pattern-controls > div:nth-child(1) > textarea').value;

    // Calculate path for Circle at center
    let path = this.calc(
      this.config.thr.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates
   **/
  calc(data) {

    // Set initial values
    let theta;
    let rho;
    let x;
    let y;

    // Calculate the maximum radius of the machine based on its dimensions
    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    let thr_commands = new Array();

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    let path = new Array();

    // Split string by line
    let lines = data.split("\n");

    // Loop through lines and extract theta-rho instructions
    lines.forEach(function(element) {
      let coordinates = element.match(/^([0-9\.]+)\s+([0-9\.]+)\s*$/)
      if (coordinates) {
        thr_commands.push([
            parseFloat(coordinates[1]),
            parseFloat(coordinates[2])
        ]);
      }
    });

    // Convert starting point from Theta-Rho to XY
    path.push([
        thr_commands[0][1] * Math.cos(thr_commands[0][0]),
        thr_commands[0][1] * Math.sin(thr_commands[0][0])
    ]);

    // Loop through subsequent commands
    for (var i = 1; i < thr_commands.length; i++) {

        // Calculate the different between the current Rho (radius) value and the previous command's
        var radius_difference = thr_commands[i][1] - thr_commands[i-1][1];

        // Calculate the difference between the current Theta (angle) value and the previous command's
        var theta_difference = thr_commands[i][0] - thr_commands[i-1][0];

        // Calculate the number of steps to make based on how many revolutions of the circle are traveled
        // Require at least one step
        var steps_per_revolution = 60;
        var steps = max(
            Math.round((Math.abs(theta_difference) / (2 * Math.PI)) * steps_per_revolution),
            1
        );

        // Loop through the steps between the two Theta-Rho commands and interpolate the XY coordinates
        for (var j = 0; j <= steps; j++) {

            // Calculate the small change (delta) of the Radius between the two steps
            var radius_delta;
            if (radius_difference > 0) {
                radius_delta = max_r * (j / steps) * (radius_difference);
            } else if (radius_difference < 0) {
                radius_delta = max_r + (max_r * (j / steps) * (radius_difference));
            } else {
                radius_delta = max_r;
            }

            // Calculate the small change (delta) of the angle Theta between the two steps
            var theta_delta = (j / steps) * (thr_commands[i][0] - thr_commands[i-1][0]);

            // Convert to cartesian coordinates
            // The negative sign on the Y Coordinate is there to reflect how I believe
            // Theta-Rho is interpreted, but I don't have a machine to verify this.
            path.push([
                radius_delta * Math.cos(theta_delta),
                - radius_delta * Math.sin(theta_delta)
            ]);
        }
    }

    return path;
  }
}