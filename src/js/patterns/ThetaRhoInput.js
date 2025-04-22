class ThetaRhoInput {

  constructor(env) {

    this.key = "thr";

    this.name = "Theta Rho Coordinates";

    this.env = env;

    let spiral_test = "# Start at Center\n0   0\n\n"
      + "# Spiral out 4 revolutions\n"
      + "25.13272 1\n\n"
      + "# Do one full circle at maximum radius\n"
      + "31.4159 1\n\n"
      + "# do 40 revs in\n"
      + "251.32.72  0\n"

    let square_test = "0 0.5\n"
      + "0.7854 0.7071\n"
      + "1.5708 0.5\n"
      + "2.3562 0.7071\n"
      + "3.1416 0.5\n"
      + "3.9270 0.7071\n"
      + "4.7124 0.5\n"
      + "5.4978 0.7071\n"
      + "6.2832 0.5\n";

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
          "value" : square_test,
          "params" : []
        }
      }
    };

    this.path = [];
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

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;

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
      let coordinates = element.match(/^([\+\-0-9\.]+)\s+([\+\-0-9\.]+)\s*$/)
      if (coordinates) {
        thr_commands.push([
          parseFloat(coordinates[1]),
          parseFloat(coordinates[2])
        ]);
      }
    });

    // Convert starting point from Theta-Rho to XY
    path.push([
      max_r * thr_commands[0][1] * Math.cos(thr_commands[0][0]),
      max_r * thr_commands[0][1] * Math.sin(thr_commands[0][0])
    ]);

    // Loop through Theta-Rho commands
    let num_thr_commands = thr_commands.length
    let substeps_per_revolution = 60;
    let num_substeps;
    for (var i = 1; i < num_thr_commands; i++) {

      // Interpolate steps. This is necessary to emulate how a Sisbot will plot the coordinates
      let theta_delta  = thr_commands[i][0] - thr_commands[i-1][0];
      let radius_delta = thr_commands[i][1] - thr_commands[i-1][1];
      num_substeps = Math.abs((theta_delta * (180/Math.PI)/360) * substeps_per_revolution);
      for (var j = 0; j < num_substeps; j++) {
        path.push([
          max_r * (thr_commands[i-1][1] + (j/num_substeps) * radius_delta) * Math.cos(thr_commands[i-1][0] + (j/num_substeps) * theta_delta),
          max_r * (thr_commands[i-1][1] + (j/num_substeps) * radius_delta) * Math.sin(thr_commands[i-1][0] + (j/num_substeps) * theta_delta)
        ]);
      }
    }

    // Convert starting point from Theta-Rho to XY
    path.push([
      max_r * thr_commands[num_thr_commands-1][1] * Math.cos(thr_commands[num_thr_commands-1][0]),
      max_r * thr_commands[num_thr_commands-1][1] * Math.sin(thr_commands[num_thr_commands-1][0])
    ]);

    // Rotate the path by a quarter revolution
    path = this.rotatePath(path, Math.PI/2);

    // Flip on the X axis
    path = this.scalePath(path, [-1, 1]);

    return path;
  }

  /**
   * Scale Path
   * path A path array of [x,y] coordinates
   * scale A value from 0 to 1
   **/
  scalePath(path, scale) {
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
  rotatePath(path, theta) {
    return path.map(function(a){
      return [
        a[0] * Math.cos(theta) - a[1] * Math.sin(theta),
        a[0] * Math.sin(theta) + a[1] * Math.cos(theta)
      ]
    });
  }
}

export default ThetaRhoInput;