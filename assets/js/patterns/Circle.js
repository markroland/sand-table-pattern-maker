class Circle {

  constructor() {

    this.name = "Circle";

    this.config = {
      "radius": {
        "name": "Radius",
        "value": 0
      },
      "radius": {
        "name": "Angle",
        "value": 0
      }
    };

    this.path = [];
  }

  setup() {

    let max_r = min((max_x - min_x), (max_y - min_y))/2;

    // Radius
    let radius_div = createDiv('<label>Radius</label>')
      .parent('pattern-controls')
      .addClass('pattern-control');
    let radius = createSlider(1, 0.5 * min(max_x,max_y), max_r/2, 1)
      .attribute('name', 'angle')
      .parent(radius_div)
      .addClass('slider');
    let radius_value = createSpan('0')
      .parent(radius_div);

    // Theta Start
    let angle_div = createDiv('<label>Start Angle</label>')
      .parent('pattern-controls')
      .addClass('pattern-control');
    let angle = createSlider(0, 360, 0, 1)
      .attribute('name', 'angle')
      .parent(angle_div)
      .addClass('slider');
    let angle_value = createSpan('0')
      .parent(angle_div);
  }

  draw() {

    // Update object
    this.config.radius = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.angle = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.angle + '°';

    // Calculate path for Circle at center
    //*
    let path = this.calc(
      0,
      0,
      this.config.radius,
      (this.config.angle / 360) * TWO_PI
    );
    //*/

    // Calculate path for Circle not at center
    /*
    var start_x = 0.25 * max_x;
    var start_y = 0.25 * max_y;
    let path = this.calc(
      start_x,
      start_y,
      this.config.radius,
      atan(start_y/start_x) + PI
    );
    //*/

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for a circle
   *
   * @param float start_x Starting X position (in G-code coordinates)
   * @param float start_y Starting Y position (in G-code coordinates)
   * @param float start_r Starting radius, where 0 is [x,y]
   * @param float start_theta Starting theta angle, between 0 and TWO_PI.
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
    // let max_r = min((max_x - min_x), (max_y - min_y))/2;
    // let sides = 30 + (radius/max_r) * 30;
    let sides = 60;

    // Loop through one revolution
    while (theta < start_theta + TWO_PI) {

       // Rotational Angle (steps per rotation in the denominator)
      theta = rotation_direction * (start_theta + (step/sides) * TWO_PI);

      // Convert polar position to rectangular coordinates
      x = start_x + (radius * cos(theta));
      y = start_y + (radius * sin(theta));

      // Add coordinates to shape array
      path[step] = [x,y];

      // Increment iteration counter
      step++;
    }

    return path;
  }
}