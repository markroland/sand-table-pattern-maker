/**
 * Frame
 */
class Frame {

  constructor(env) {

    this.key = "frame";

    this.name = "Frames (Border Patterns)";

    this.env = env;

    this.config = {
      "num_spiral": {
        "name": "Spirals",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            12,
            4,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "a": {
        "name": "a",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1.0,
            1.0,
            0.5,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "b": {
        "name": "b",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1.0,
            0.0,
            -0.35,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "revolutions": {
        "name": "Revolutions",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0.1,
            4,
            2,
            0.1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rotate": {
        "name": "Rotate",
        "value": null,
        "input": {
          "type": "createSlider",
          "params": [
            0,
            360,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

    this.path = [];
  }

  /**
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    // Read in selected value(s)
    this.config.num_spiral.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.a.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.b.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.revolutions.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);
    this.config.rotate.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(5) > input').value);

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.num_spiral.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.a.value.toFixed(2) + " * r<sub>max</sub>";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.b.value.toFixed(2);
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.revolutions.value.toFixed(1);
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.rotate.value + "°";

    // Calculate path
    let path = this.calc(
      this.config.num_spiral.value,
      this.config.a.value,
      this.config.b.value,
      this.config.revolutions.value,
      60
    );

    // Rotate path around the center of drawing area
    if (this.config.rotate.value > 0) {
      path = this.rotationMatrix(path, this.config.rotate.value * (Math.PI/180));
    }

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(num_spirals, a, b, revolutions, sides = 60) {

    const max_x = this.env.table.x.max;
    const max_y = this.env.table.y.max;

    let radius = Math.min(max_x/2, max_y/2);

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    let spiral = this.LogSpiral(a, b, revolutions, sides)

    var translate_x = -spiral[0][0];
    spiral = this.translate_path(spiral, translate_x, 0)
    spiral = this.rotationMatrix(spiral, -0.100 * Math.PI)
    spiral = this.translate_path(spiral, radius, 0)

    var master_path = new Array();

    for (var j = 0; j <= sides; j++) {

      // Go clockwise
      master_path.push([
        radius * Math.cos((j/sides) * 2 * Math.PI),
        -radius * Math.sin((j/sides) * 2 * Math.PI)
      ])

      // Draw spiral
      // Note: This will re-draw the first/last spiral
      // I'm okay with this because it ends the pattern more nicely
      if (j % (sides/num_spirals) < 1) {
        master_path = master_path.concat(
          this.rotationMatrix(spiral, -(j/sides) * 2 * Math.PI)
        );
      }
    }

    return master_path;
  }

  /**
   * Translate a path
   **/
  translate_path(path, x_delta, y_delta) {
    return path.map(function(a){
      return [
        a[0] + x_delta,
        a[1] + y_delta
      ];
    });
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(path, theta) {
    return path.map(function(a){
      return [
        a[0] * Math.cos(theta) - a[1] * Math.sin(theta),
        a[0] * Math.sin(theta) + a[1] * Math.cos(theta)
      ]
    });
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  LogSpiral(a, b, revolutions, sides) {

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;

    // Set initial values
    var x;
    var y;

    // Calculate the maximum radius
    var max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Set max rotations. Go over by 1 "side" so that endpoint completes a full rotation
    let theta_max = (revolutions + 1/sides) * (2 * Math.PI);

    // Set the change per increment
    let delta_theta = (2 * Math.PI) / sides;

    // Loop through each angle segment
    for (let theta = 0; theta < theta_max; theta += delta_theta) {

      // Convert polar position to rectangular coordinates
      x = max_r * a * Math.exp(b * theta) * Math.cos(theta);
      y = max_r * a * Math.exp(b * theta) * Math.sin(theta);

      // Add coordinates to shape array
      path.push([x,y]);
    }

    // Reverse path
    // This may be able to be accomplished more elegantly,
    // but Array reverse was not working well for multi-dimensional arrays
    var reverse_path = new Array();
    for (var i=0; i < path.length; i++) {
      reverse_path.push(path[(path.length-1) - i]);
    }
    path = path.concat(reverse_path);

    return path;
  }

}

export default Frame;