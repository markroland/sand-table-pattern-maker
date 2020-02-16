class Coordinates {

  constructor() {

    this.key = "coordinates";

    this.name = "XY Coordinates";

    this.config = {
      "coordinates": {
        "name": "Coordinates",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 11,
            "cols": 12,
          },
          "value" : "100,0\n0,100\n-100,0\n0,-100\n100,0",
          "params" : []
        }
      }
    };

    this.path = [];
  }

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
      } else if (val.input.type == "createTextarea") {
        control.input = createElement("textarea", val.input.value)
          .attribute("rows", val.input.attributes.rows)
          .attribute("cols", val.input.attributes.cols)
          .attribute('name', key)
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
    this.config.coordinates.value = document.querySelector('#pattern-controls > div:nth-child(1) > textarea').value;

    // Calculate path for Circle at center
    let path = this.calc(
      this.config.coordinates.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates
   **/
  calc(data) {

    // Set initial values
    let x;
    let y;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    let path = new Array();

    // Split string by line
    let lines = data.split("\n");

    // Loop through lines and split by comma
    lines.forEach(function(element) {

      let coordinates = element.split(",");
      x = parseFloat(coordinates[0]);
      y = parseFloat(coordinates[1]);

      // Add coordinates to shape array
      path.push([x,y]);
    })

    return path;
  }
}