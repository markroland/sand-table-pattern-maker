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
          "type": "createInput",
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

    let controls = new Array();
    const configs = Object.entries(this.config);
    for (const [key, val] of configs) {

      // Create a new object
      var control = new Object();

      // Create the div that contains the control
      control.div = createDiv('<label>' + val.name + '</label>')
        .parent('pattern-controls')
        .addClass('pattern-control');

      // Create the control form input
      // TODO: make this dynamic
      if (val.input.type == "createSlider") {
        control.input = createSlider(val.input.params[0], val.input.params[1], val.input.params[2], val.input.params[3])
          .attribute('name', key)
          .parent(control.div)
          .addClass(val.input.class);
      } else if (val.input.type == "createInput") {
        control.input = createInput(val.input.params[0], val.input.params[1], val.input.params[2])
          .attribute("type", "checkbox")
          .attribute('name', key)
          .attribute('checkbox', null)
          .parent(control.div);
      }

      // Create a span element to display the current input's value (useful for Sliders)
      if (val.input.displayValue) {
        let radius_value = createSpan('0')
          .parent(control.div);
      }

      // Add to "controls" object
      controls.push(control);
    }
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
    var path = new Array();

    let y_center = (cross_intersect * cross_height) - (cross_height/2);

    path = [
      [0,0],
      [0, y_center],
      [-cross_width/2, y_center],
      [0, y_center],
      [0, cross_height/2],
      [0, y_center],
      [cross_width/2, y_center],
      [0, y_center],
      [0, -cross_height/2],
      [0, y_center]
    ];

    return path;
  }
}