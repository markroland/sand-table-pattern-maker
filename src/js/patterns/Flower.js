import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';
import Fibonacci from './Fibonacci.js';

class Flower {

  #petal = [
    [0.08,-0.274],
    [0.087,-0.274],
    [0.288,-0.272],
    [0.309,-0.267],
    [0.316,-0.27],
    [0.337,-0.272],
    [0.358,-0.267],
    [0.413,-0.265],
    [0.434,-0.26],
    [0.503,-0.258],
    [0.524,-0.253],
    [0.557,-0.251],
    [0.573,-0.247],
    [0.594,-0.244],
    [0.615,-0.24],
    [0.628,-0.237],
    [0.649,-0.233],
    [0.661,-0.23],
    [0.677,-0.226],
    [0.689,-0.223],
    [0.705,-0.219],
    [0.719,-0.216],
    [0.753,-0.205],
    [0.76,-0.203],
    [0.781,-0.198],
    [0.788,-0.196],
    [0.869,-0.161],
    [0.874,-0.159],
    [0.885,-0.156],
    [0.89,-0.154],
    [0.925,-0.133],
    [0.929,-0.131],
    [0.946,-0.119],
    [0.95,-0.117],
    [0.966,-0.105],
    [0.971,-0.103],
    [0.973,-0.098],
    [0.978,-0.096],
    [0.983,-0.091],
    [1.015,-0.059],
    [1.02,-0.054],
    [1.022,-0.05],
    [1.027,-0.047],
    [1.029,-0.043],
    [1.045,-0.003],
    [1.047,0.038],
    [1.05,0.059],
    [1.036,0.094],
    [1.034,0.101],
    [1.029,0.108],
    [1.027,0.115],
    [1.022,0.119],
    [1.02,0.124],
    [1.015,0.128],
    [0.918,0.2],
    [0.774,0.253],
    [0.737,0.263],
    [0.691,0.274],
    [0.656,0.277],
    [0.635,0.281],
    [0.601,0.284],
    [0.58,0.288],
    [0.538,0.291],
    [0.517,0.295],
    [0.274,0.293],
    [0.253,0.288],
    [0.212,0.286],
    [0.191,0.281],
    [0.17,0.279],
    [0.149,0.274],
    [0.122,0.272],
    [0.101,0.267],
    [0.082,0.265],
    [0.066,0.26],
    [0.041,0.258],
    [0.024,0.253],
    [-0.017,0.251],
    [-0.038,0.247],
    [-0.052,0.244],
    [-0.073,0.24],
    [-0.087,0.237],
    [-0.108,0.233],
    [-0.128,0.23],
    [-0.149,0.226],
    [-0.154,0.223],
    [-0.17,0.219],
    [-0.189,0.216],
    [-0.226,0.205],
    [-0.23,0.203],
    [-0.247,0.198],
    [-0.26,0.196],
    [-0.281,0.191],
    [-0.286,0.189],
    [-0.323,0.177],
    [-0.33,0.175],
    [-0.365,0.163],
    [-0.369,0.161],
    [-0.406,0.149],
    [-0.411,0.147],
    [-0.427,0.142],
    [-0.434,0.14],
    [-0.441,0.135],
    [-0.446,0.128],
    [-0.45,0.126],
    [-0.455,0.126],
    [-0.462,0.128],
    [-0.469,0.128],
    [-0.473,0.126],
    [-0.483,0.117],
    [-0.503,0.101],
    [-0.51,0.101],
    [-0.536,0.098],
    [-0.552,0.094],
    [-0.559,0.091],
    [-0.691,0.036],
    [-0.698,0.034],
    [-0.76,0.01],
    [-0.765,0.008],
    [-0.781,0.003],
    [-0.788,0.001],
    [-0.809,-0.003],
    [-0.816,-0.006],
    [-0.858,-0.017],
    [-0.865,-0.02],
    [-0.885,-0.024],
    [-0.89,-0.027],
    [-0.906,-0.031],
    [-0.913,-0.034],
    [-0.934,-0.038],
    [-0.953,-0.041],
    [-0.969,-0.045],
    [-0.994,-0.047],
    [-1.01,-0.052],
    [-1.031,-0.054],
    [-1.052,-0.059],
    [-1.059,-0.061],
    [-1.08,-0.066],
    [-1.087,-0.068],
    [-1.108,-0.073],
    [-1.112,-0.075],
    [-1.119,-0.082],
    [-1.122,-0.094],
    [-1.117,-0.124],
    [-1.11,-0.131],
    [-1.101,-0.135],
    [-1.094,-0.135],
    [-1.024,-0.133],
    [-1.003,-0.128],
    [-0.955,-0.122],
    [-0.948,-0.122],
    [-0.781,-0.131],
    [-0.76,-0.135],
    [-0.719,-0.138],
    [-0.698,-0.142],
    [-0.67,-0.145],
    [-0.649,-0.149],
    [-0.635,-0.152],
    [-0.615,-0.156],
    [-0.608,-0.159],
    [-0.587,-0.163],
    [-0.573,-0.166],
    [-0.552,-0.17],
    [-0.538,-0.172],
    [-0.531,-0.172],
    [-0.524,-0.175],
    [-0.517,-0.175],
    [-0.51,-0.177],
    [-0.503,-0.177],
    [-0.497,-0.179],
    [-0.434,-0.198],
    [-0.427,-0.2],
    [-0.406,-0.205],
    [-0.392,-0.207],
    [-0.323,-0.226],
    [-0.316,-0.228],
    [-0.295,-0.233],
    [-0.281,-0.235],
    [-0.26,-0.24],
    [-0.253,-0.242],
    [-0.233,-0.247],
    [-0.205,-0.249],
    [-0.184,-0.253],
    [-0.101,-0.256],
    [-0.08,-0.26],
    [0.01,-0.263],
    [0.031,-0.267],
    [0.08,-0.274]
  ];

  constructor(env) {
    this.key = this.constructor.name.toLowerCase();
    this.name = this.constructor.name;
    this.env = env;

    this.max_r = 0.5 * Math.min(
      (env.table.x.max - env.table.x.min),
      (env.table.y.max - env.table.y.min)
    );

    this.config = {
      "petals": {
        "name": "Petals",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            13,
            31,
            23,
            2
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

    const PathHelp = new PathHelper();

    this.path = [];
  }

  draw() {

    // Update object
    this.config.petals.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.petals.value;

    // Calculate path for Circle at center
    // if (!this.path.length) {
      this.path = this.constructPath();
    // }

    return this.path;
  }

  /**
   * Calculate coordinates for a circle
   **/
  constructPath() {

    const PathHelp = new PathHelper();

    const outline_petal = true;

    // Start path at far right
    let path = [
      [0,0]
    ];

    const floret_radius = 0.25 * this.max_r;

    let petals = [];
    const i_max = this.config.petals.value;
    for (let i = 0; i < i_max; i++) {

      let petal = this.modelPetal(
        PathHelp.getRandom(0.5, 0.6) * this.max_r, // Max is (max_r - floret_radius)
        PathHelp.getRandom(0.12, 0.16) * this.max_r
      );

      // Shift the path so the stopping point is at the base of the petal
      petal = PathHelp.shiftPath(petal, 45);

      // Use fewer points
      petal = PathHelp.simplify(petal, this.env.ball.diameter, Math.PI/12);

      // Set the petal angle for the iteration
      let theta = - (i / i_max) * 2 * Math.PI;

      // Create a fill for the petal shape and apply it to the iteration output
      const fill_angle = PathHelp.getRandom(-0.08, 0.08) * Math.PI;
      const fill_spacing = 0.5 * this.env.ball.diameter
      const fill = PathHelp.fill(petal, fill_spacing, fill_angle, true, true)[0];
      let petal_i = fill;

      // Apply an offset outline
      if (outline_petal) {

        const nearest_perimeter_point = this.nearestPointOnPath(fill[fill.length - 1], petal);

        const petal_offset = PathHelp.offsetPath(petal, 0.5 * this.env.ball.diameter);

        petal_i = petal_i.concat(petal_offset.slice(nearest_perimeter_point));
        petal_i = petal_i.concat(petal_offset);
      }

      // Offset the petal from the center
      petal_i = PathHelp.translatePath(petal_i, [floret_radius, 0]);

      // Rotate petal slightly so each petal isn't perfectly uniform
      petal_i = PathHelp.rotatePath(petal_i, PathHelp.getRandom(-0.01, 0.01) * Math.PI);

      // Optional: Move in/out randomly for each petal
      // petal_i = PathHelp.translatePath(petal_i, [ PathHelp.getRandom(0.1, 0.2) * this.max_r, 0]);

      // Rotate to the final location around the center
      petal_i = PathHelp.rotatePath(petal_i, theta);

      petals.push(petal_i);
    }

    // Randomize the order of the petals so that they overlap in an organic manner
    petals = PathHelp.shufflePaths(petals);

    // Create a connection point for each petal
    // This could be an arc or simply returning to the center
    petals.forEach(petal_i => {

      let connector = [];

      // connector = Utilities.arcBetweenPoints(
      //   ...path[path.length - 1],
      //   ...petal_i[0],
      //   12
      // );

      // connector = PathHelp.quadraticBezierPath(
      //   path[path.length - 1],
      //   [0,0],
      //   petal_i[0],
      //   12
      // );

      // Example
      // connector = Utilities.polarTransition(
      //   -0.25 * Math.PI,
      //   80,
      //   1.25 * Math.PI,
      //   100,
      //   true,
      //   20
      // );

      connector = [
        [0,0]
      ];

      path = path.concat(connector);
      path = path.concat(petal_i);
    });

    // Finish at the center
    path.push([0,0]);

    // Create the floret at the center of the flower
    const fibonacciInstance = new Fibonacci(this.env);
    let floret = fibonacciInstance.createFloret(
      0.12 * Math.min(this.env.table.x.max - this.env.table.x.min, this.env.table.y.max - this.env.table.y.min),
      149,
      "easeInSine",
      "bezier",
      true
    );

    path = path.concat(floret);

    return path;
  }


  /**
   * Create the path for an individual petal. This uses a standard prototype
   * and scales the height/width
   * @param {number} [width=1] - The desired width
   * @param {number} [height=0.262] - The desired height. The default value matches
   * the prototype's proportions
   * @returns {array} A Path array
   **/
  modelPetal(width = 1, height = 0.262) {

    const PathHelp = new PathHelper();

    // Simple Ellipse
    /*
    const ellipse_segments = 60;
    let ellipse = PathHelp.ellipse(
      width,
      height,
      ellipse_segments
    );
    ellipse.pop();
    ellipse = PathHelp.shiftPath(ellipse, 0.5 * ellipse_segments);
    ellipse.push(ellipse[0]);
    ellipse.reverse();
    //*/

    let petal_prototype = this.#petal;

    // Get bounding box of path. Resize and position the petal around the origin (center of flower)
    const info = PathHelp.info(petal_prototype);

    const scale_x =  width / (info.max[0] - info.min[0]);
    const scale_y = height / (info.max[1] - info.min[1]);

    // Translate left-most side to center
    petal_prototype = PathHelp.translatePath(petal_prototype, [-info.min[0], 0.1]);

    // Rotate so the petal start/stop are on the same horizontal line
    petal_prototype = PathHelp.rotatePath(petal_prototype, -0.02 * Math.PI);

    // Scale to requested size
    petal_prototype = PathHelp.scalePath(petal_prototype, [scale_x, scale_y]);

    return petal_prototype;
  }

  /*
  * Draw Fibonacci Spiral Spokes
  *
  * Type: Radial
  **/
  floret(radius, radius_shrink_factor)
  {

    const PathHelp = new PathHelper();

    const ball_size = this.env.ball.diameter;

    var path = [];
    const r_max = radius;
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

      if (path.length) {

        let bezier = PathHelp.quadraticBezierPath(
          path[path.length - 1],
          [0, 0],
          [x, y],
          10
        );

        bezier = bezier.slice(1, -1);

        path = path.concat(bezier);
      }

      // Add new point to path
      path.push([x,y]);
    }

    // Always end in center
    path.push([0,0]);

    return path;
  }

  /**
   * Given a point and a path, find the point on the path nearest
   * the given point
   * @param {*} point
   * @param {*} path
   */
  nearestPointOnPath(point, path) {
    let minDist = Infinity;
    let nearestIndex = -1;

    for (let i = 0; i < path.length; i++) {
      const dx = point[0] - path[i][0];
      const dy = point[1] - path[i][1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDist) {
        minDist = dist;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  }
}

export default Flower;