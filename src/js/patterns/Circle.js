class Circle {

  constructor(env) {

    this.key = "circle";

    this.name = "Circle";

    const max_r = Math.min((env.table.x.max - env.table.x.min), (env.table.y.max - env.table.y.min))/2;

    this.config = {
      "radius": {
        "name": "Radius (r)",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            0.5 * Math.min(env.table.x.max, env.table.y.max),
            max_r/2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "angle": {
        "name": "Start Angle (𝜃)",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            360,
            0,
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
    this.config.angle.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.radius.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.angle.value + '°';

    // Calculate path for Circle at center
    //*
    let path = this.calc(
      0,
      0,
      this.config.radius.value,
      (this.config.angle.value / 360) * (2 * Math.PI)
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

export default Circle;