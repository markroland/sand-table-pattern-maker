class Rectangle {

  constructor() {

    this.key = "rectangle";

    this.name = "Rectangle";

    this.config = {
      "width": {
        "name": "Width",
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
      "height": {
        "name": "Height",
        "value": 0,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            (max_y - min_y),
            (max_y - min_y) / 2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      // "lock": {
      //   "name": "Lock Proportions",
      //   "value": 0,
      //   "input": {
      //     "type": "createCheckbox",
      //     "attributes" : [{
      //       "type" : "checkbox",
      //       "checked" : null
      //     }],
      //     "params": [0, 1, 0],
      //     "displayValue": false
      //   }
      // },
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

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.width.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.height.value;

    // Calculate path for Circle at center
    let path = this.calc(
      parseFloat(this.config.width.value),
      parseFloat(this.config.height.value)
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param float width Rectangle Width
   * @param float height Rectangle Height
   *
   * @return Array Path
   **/
  calc(width, height) {
    return [
      [- width/2, - height/2],
      [+ width/2, - height/2],
      [+ width/2, + height/2],
      [- width/2, + height/2],
      [- width/2, - height/2],
    ];
  }
}