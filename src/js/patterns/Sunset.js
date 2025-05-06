class Sunset {

  constructor(env) {

    this.key = "sunset";

    this.name = "Sunset";

    this.env = env;

    this.config = {};

    this.path = [];
  }

  draw() {

    const max_r = 0.5 * Math.min(
      (this.env.table.x.max - this.env.table.x.min),
      (this.env.table.y.max - this.env.table.y.min)
    );

    const center = {
      x: (this.env.table.x.max + this.env.table.x.min) / 2,
      y: (this.env.table.y.max + this.env.table.y.min) / 2
    }

    let path = [max_r, 0]

    // Move from required Sisyphus starting point at rho-theta [1,0] to top
    let i_max = 12;
    for (let i = 0; i <= i_max; i++) {
      path.push([
        max_r * Math.cos(i/i_max * (0.5 * Math.PI)),
        max_r * Math.sin(i/i_max * (0.5 * Math.PI))
      ]);
    }

    // Draw horizontal lines
    let j_max = 20;
    for (let j = 1; j <= j_max; j++) {
      const direction = (j % 2 == 0) ? 1 : -1;
      // const y = max_r - j * (1 * this.env.ball.diameter);
      const y = max_r * Math.exp(-(j/j_max) * 1.0);

      const x_start = direction * Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));
      const x_end = direction * -Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));
      path.push(
        [x_start, y],
        [x_end, y]
      );
    }

    // Save y value of horizon position
    const y_horizon = path[path.length - 1][1];

    // Go to center
    path.push([0, path[path.length - 1][1]]);

    // Spiral out
    let last = path[path.length - 1];
    for (let i = 1; i <= 5; i++) {
      let j_max = 24;
      for (let j = 0; j <= j_max; j++) {
        const theta = (j/j_max) * (2 * Math.PI) - 0.5 * Math.PI;
        const r = max_r * (i/j_max);
        path.push([
          last[0] + r * Math.cos(theta),
          last[1] + r * Math.sin(theta)
        ]);
      }
    }

    // Go to Horizon
    path.push([
      -Math.sqrt(Math.pow(max_r, 2) - Math.pow(y_horizon, 2)),
      y_horizon
    ]);

    // Draw horizontal lines
    j_max = 70;
    let y = y_horizon;
    let j = 0;
    while (y > -(0.5 * (this.env.table.y.max - this.env.table.y.min))) {

      const direction = (j % 2 === 0) ? 1 : -1;

      // Calculate spacing using exponential interpolation
      const t = j / (j_max - 1); // Normalized step (0 to 1)
      const spacing = 0.33 * this.env.ball.diameter * Math.pow(2 / 0.33, t); // Exponential growth

      const x_start = direction * Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));

      const x_end = direction * -Math.sqrt(Math.pow(max_r, 2) - Math.pow(y, 2));
      path.push(
        [x_start, y],
        [x_end, y]
      );

      // Update y position
      y -= spacing;
      j++;
    }

    // Return to Sisyphus "Home" [1, 0]
    //*
    path = path.concat(this.#arcToHome(
      path[path.length - 1][0],
      path[path.length - 1][1],
      max_r,
      -1
    ));
    //*/

    // Update object
    this.path = path;

    return path;
  }

  #easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  /**
   *
   * @todo Use direction to go the other way
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   * @param {number} direction
   * @param {number} steps
   * @returns
   */
  #arcToHome(x, y, radius, direction, steps = 30) {
    let path = [];
    const i_max = steps;
    let theta = Math.atan2(y, x);
    if (theta < 0) {
      theta += 2 * Math.PI;
    }
    for (let i = 0; i <= i_max; i++) {
      let angle = theta - (i/i_max) * theta;
      if (direction < 0) {
        angle = theta + (i/i_max) * (Math.PI * 2 - theta);
      }

      // let angle = theta - (i/i_max) * (Math.PI * 2 - theta);
      // if (direction > 0) {
      //   // TODO: Fix this
      //   angle = (i/i_max) * theta;
      // }


      path.push([
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ]);
    }
    return path;
  }

}

export default Sunset;