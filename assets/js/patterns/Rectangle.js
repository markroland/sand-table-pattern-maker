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
      "lock": {
        "name": "Lock Proportions",
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