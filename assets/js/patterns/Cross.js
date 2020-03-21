class Cross {

  constructor() {

    this.key = "cross";

    this.name = "Cross";

    this.config = {
      "width": {
        "name": "Width",
        "value": 0,
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
        "value": 0,
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
        "value": 75,
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

  /**
   * Setup the controls for the pattern.
   *
   * @return Null
   **/
  setup() {
    return null;
  }

  draw() {

    // Update object
    this.config.width.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.height.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.intersect.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.width.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.height.value + " " + units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.intersect.value + "%";

    // Calculate path for Circle at center
    let path = this.calc(
      parseInt(this.config.width.value),
      parseInt(this.config.height.value),
      parseFloat(this.config.intersect.value/100)
    );

    // If pattern is reversed, then remove first (which will be last) point from path
    if (document.querySelector('#pattern-controls input[name=reverse]').checked) {
      path.shift();
    }

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
  calc(cross_width, cross_height, cross_intersect) {

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array([0,0]);

    let y_center = (cross_intersect * cross_height) - (cross_height/2);

    let increment = ball_size/2;
    let rotations = 3;
    var offset;

    for (var i = 0; i < rotations; i++) {
      offset = i * increment;
      path = path.concat([
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

    // Return to center
    // path.push([0, y_center]);

    return path;
  }
}