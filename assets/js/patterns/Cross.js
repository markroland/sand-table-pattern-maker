class Cross {

  constructor() {

    this.key = "cross";

    this.name = "Cross";

    this.config = {
      "width": {
        "name": "Width",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            (max_x - min_x),
            0.3 * (max_x - min_x),
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "height": {
        "name": "Height",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            (max_x - min_x),
            (max_x - min_x) / 2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "intersect": {
        "name": "Intersect Height",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            100,
            75,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "starburst": {
        "name": "Starburst",
        "value": null,
        "input": {
          "type": "createCheckbox",
          "attributes" : [{
            "type" : "checkbox",
            "checked" : true
          }],
          "params": [0, 1, 1],
          "displayValue": false
        }
      }
    };

    this.path = [];
  }

  draw() {

    // Update object
    this.config.width.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.height.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.intersect.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);

    this.config.starburst.value = false;
    if (document.querySelector('#pattern-controls > div:nth-child(4) > input[type=checkbox]').checked) {
      this.config.starburst.value = true;
    }

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.width.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.height.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.intersect.value + "%";

    // Calculate path for Circle at center
    let path = this.calc(
      this.config.width.value,
      this.config.height.value,
      this.config.intersect.value/100,
      this.config.starburst.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer cross_width Cross Width
   * @param integer cross_height Cross Height
   * @param float cross_intersect Height of horizontal bar as percentage of the height
   *
   * @return Array Path
   **/
  calc(cross_width, cross_height, cross_intersect, starburst) {

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    let y_center = (cross_intersect * cross_height) - (cross_height/2);

    let increment = ball_size/2;
    let rotations = 3;
    var offset;

    if (starburst) {
      path.push([0, y_center]);
      let r;
      let rx;
      let ry;
      let r_scale = 1.0;
      let max_r = Math.min(max_x - min_x, max_y - min_y);
      for (var i = 0; i < 16; i++){

        // Calculate ellipse radius
        rx = (cross_width / 2) + ((rotations + 3) * increment);
        ry = (cross_height / 2) + ((rotations + 3) * increment) - y_center;

        // Extend rays of the bottom half
        if (i/16 > 0.5) {
          ry = (cross_height / 2) + ((rotations + 3) * increment) + y_center;
        }

        // 45-degree rays
        if ((i + 2) % 4 == 0) {
          rx = 0.9 * rx;
          ry = 0.9 * ry;
        }

        // Odd Rays
        if ((i + 1) % 2 == 0) {
          rx = 0.8 * rx;
          ry = 0.8 * ry;
        }

        path.push([
          rx * Math.cos(i/16 * (2 * Math.PI)),
          ry * Math.sin(i/16 * (2 * Math.PI)) + y_center
        ]);
        path.push([0, y_center]);
      }
    }

    // Cross path
    var cross_path = new Array();
    for (var i = 0; i < rotations; i++) {
      offset = i * increment;
      cross_path = cross_path.concat([
        [0 - offset, y_center - offset],
        [-cross_width/2 - offset, y_center - offset],
        [-cross_width/2 - offset, y_center + offset],
        [0 - offset, y_center + offset],
        [0 - offset, cross_height/2 + offset],
        [0 + offset, cross_height/2 + offset],
        [0 + offset, y_center + offset],
        [cross_width/2 + offset, y_center + offset],
        [cross_width/2 + offset, y_center - offset],
        [0 + offset, y_center - offset],
        [0 + offset, -cross_height/2 - offset],
        [0 - offset, -cross_height/2 - offset],
        [0 - offset, y_center - offset]
      ]);
    }

    // Reverse path
    // This may be able to be accomplished more elegantly,
    // but Array reverse was not working well for multi-dimensional arrays
    var reverse_path = new Array();
    for (var i=0; i < cross_path.length; i++) {
      reverse_path.push(cross_path[(cross_path.length-1) - i]);
    }
    path = path.concat(reverse_path);

    // Return to center
    // path.push([0, y_center]);

    return path;
  }
}