class Egg {

  constructor() {

    this.key = "egg";

    this.name = "Easter Eggs";

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    this.config = {
      "radius": {
        "name": "Size",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            80,
            0.5 * Math.min(max_x,max_y),
            max_r/2,
            1
          ],
          "class": "slider",
          "displayValue": true
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
    this.config.radius.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius.value;

    // Calculate path for Circle at center
    let path = this.calc(
      this.config.radius.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Egg
   **/
  calc(radius, rotation_direction = 1) {

    // Set initial values
    var x;
    var y;
    var theta;
    let egg_path = new Array();
    let egg_1;
    let egg_2;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();
    var point = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the shape.
    // A larger number makes the shape more smooth
    let sides = 60;

    // Calculate standard Egg shape
    for (var i = 0; i <= sides; i++) {

      // Rotational Angle
      theta = (i/sides) * (2 * Math.PI) - Math.PI;

      // Get coordinates for shape
      point = this.parametricEgg(theta);

      // Add coordinates to shape array
      egg_path.push([
        radius * point[0],
        radius * point[1]
      ]);
    }

    // Move Standard Egg to Center
    let path_center = this.getPathCenter(egg_path);
    egg_path = this.translatePath(egg_path, [-path_center[0], -path_center[1]]);

    // Rotate 90 degrees clockwise so it's "up"
    egg_path = this.rotatePath(egg_path, -0.5 * Math.PI);

    // Use the Egg path to create an Egg filled with a spiral
    let spiral_path = this.spiralizePath(egg_path, 10, 60);
    egg_1 = egg_path.concat(spiral_path.reverse());
    egg_1 = this.rotatePath(egg_1, Math.PI/10);
    egg_1 = this.translatePath(egg_1, [-30, 0])

    // Use the Egg path to create an Egg filled with stripes
    let stripe_path = this.stripePath(egg_path);
    egg_2 = stripe_path.reverse();
    egg_2 = egg_2.concat(egg_path);
    egg_2 = this.scalePath(egg_2, 0.8);
    egg_2 = this.translatePath(egg_2, [30, 0]);
    egg_2 = this.rotatePath(egg_2, -Math.PI/8);

    // Join Egg 1 with Egg 2
    path = egg_1.concat(egg_2)

    return path;
  }

  /**
  * Parametric Equation for an Egg shape
  *
  * https://math.stackexchange.com/questions/3375853/parametric-equations-for-a-true-egg-shape
  */
  parametricEgg(theta) {

    let x,y;
    let k = 1.00;
    let b = 2.02

    x = (1 / (2 * Math.sqrt(1 + Math.pow(k,2))))
      * (
        (((Math.pow(k,2) - 1)/k)*b)
        + (
            (((Math.pow(k,2) + 1)/k)*b)
            *
            Math.sqrt(Math.pow(b,2) - 4 * k * Math.cos(theta))
          )
      );

    y = (2 * Math.sin(theta))
      / (
        b + Math.sqrt(Math.pow(b,2) - 4 * k * Math.cos(theta))
      );

    // This is my customization because the equations as translated
    // from the source web site didn't look quite right.
    x = 0.4 * x;

    return [x, y];
  }

  /**
   * Return column of a multidimensional array
   **/
  arrayColumn(arr, n) {
    return arr.map(a => a[n]);
  }

  /**
   * Get the center point of the path
   **/
  getPathCenter(path) {

    // Get X and Y coordinates as an 1-dimensional array
    let x_coordinates = this.arrayColumn(path, 0);
    let y_coordinates = this.arrayColumn(path, 1);
    let min_x = Math.min(...x_coordinates)
    let min_y = Math.min(...y_coordinates);

    return [
      min_x + (Math.max(...x_coordinates) - min_x) / 2,
      min_y + (Math.max(...y_coordinates) - min_y) / 2
    ];
  }

  /**
   * Fill Path with Stripes
   * This doesn't do what I want, which is horizontal, level stripes,
   * but it's fine for now.
   **/
  stripePath(path) {
    let new_path = new Array();
    let index;
    for (var i = 0; i < path.length; i++) {
      if (i % 4 == 0) {
        index = i;
      } else if (i % 4 == 1) {
        index = i;
      } else if (i % 4 == 2) {
        index = path.length - i;
      } else if (i % 4 == 3) {
        index = path.length - i;
      }
      new_path.push(path[index]);
    }
    return new_path;
  }

  /**
   * Spiralize Path
   **/
  spiralizePath(path, revolutions) {
    let point = new Array();
    let new_path = new Array();
    let i_max = path.length * revolutions;
    // let path_center = this.getPathCenter(path);
    let spiral_center = [0, -50]
    for (var i = 0; i < i_max; i++) {
      point = [
        path[i % path.length][0],
        path[i % path.length][1]
      ]
      new_path.push([
        -((point[0] * (i/i_max)) + (-spiral_center[0] * i/i_max))+spiral_center[0],
        ((point[1] * (i/i_max)) + (-spiral_center[1] * i/i_max))+spiral_center[1],
      ]);
    }
    return new_path;
  }

  /**
   * Scale Path
   * path A path array of [x,y] coordinates
   * scale A value from 0 to 1
   **/
  scalePath(path, scale) {
    return path.map(function(a){
      return [
        a[0] * scale,
        a[1] * scale
      ];
    });
  }

  /**
   * Translate a path
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