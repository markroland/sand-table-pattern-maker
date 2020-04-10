class Egg {

  constructor() {

    this.key = "egg";

    this.name = "Egg";

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    this.config = {
      "radius": {
        "name": "Radius (r)",
        "value": max_r/2,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
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
        "value": 0,
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
    this.config.radius.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;

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

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();
    var point = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the shape.
    // A larger number makes the shape more smooth
    let sides = 60;

    // Loop through one revolution
    for (var i = 0; i <= sides; i++) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = (i/sides) * (2 * Math.PI);

      point = this.parametricEgg(theta);

      // Add coordinates to shape array
      path.push([
        0.5 * radius * point[0] - 100,
        radius * point[1]
      ]);
    }

    path = this.rotatePath(path, -0.5 * Math.PI);

    let spiral_path = this.spiralizePath(path, 10, 60);

    path = path.concat(spiral_path.reverse());

    return path;
  }

  /**
  * https://math.stackexchange.com/questions/3375853/parametric-equations-for-a-true-egg-shape
  */
  parametricEgg(theta) {

    let x,y;
    let k = 1;
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

    return [x, y];
  }

  /**
   * Spiralize Path
   **/
  spiralizePath(path, revolutions) {
    let new_path = new Array();
    let i_max = path.length * revolutions;
    for (var i = 0; i < i_max; i++) {
      new_path.push([
        -path[i % path.length][0] * (i/i_max),
        path[i % path.length][1] * (i/i_max)
      ]);
    }
    return new_path;
  }

  /**
   * Scale Path
   **/
  scalePath(path, width, height) {
    return path.map(function(a){
      return [
        a[0] * width,
        a[1] * height
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