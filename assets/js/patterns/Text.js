class Text {

  constructor() {

    this.key = "text";

    this.name = "Text";

    this.line_height = 40;
    this.char_width = this.line_height / 2;

    this.config = {
      "text": {
        "name": "Text",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 11,
            "cols": 22,
          },
          "value" : "Hello World",
          "params" : []
        }
      },
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

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    let path = new Array();

    // Update object
    this.config.text.value = document.querySelector('#pattern-controls > div:nth-child(1) > textarea').value;

    // Return single-point path if string is empty
    // This prevents the main "draw" function from breaking
    if (this.config.text.value < 1) {
      path = [[0,0]];
      return path;
    }

    // Loop through text string and build each character
    let x = 0;
    let y = 0;
    let i_max = this.config.text.value.length;
    for (var i = 0; i < i_max; i++) {
      path = path.concat(this.draw_character(x, y, this.config.text.value.charAt(i)));
      x += this.char_width;

      // Add connector if not the last letter
      if (i != i_max) {
        x += (0.4 * this.char_width);
        path = path.concat([x, 0]);
      }
    }

    return path;
  }

  draw_character(x, y, character) {

    let path = new Array();

    switch(character) {
      case " ":
        path = [
          [this.char_width, 0]
        ];
        break;
      case "A":
        path = [
          [0,0],
          [this.char_width/2, this.line_height],
          [0.75 * this.char_width, this.line_height/2],
          [0.25 * this.char_width, this.line_height/2],
          [0.75 * this.char_width, this.line_height/2],
          [this.char_width, 0]
        ];
        break;
      default:
        path = [
          [0, 0],
          [0, this.line_height],
          [this.char_width, this.line_height],
          [this.char_width, 0],
          [0, 0],
          [this.char_width, 0]
        ];
    }

    // Move each character coordinate over
    path = this.translate_path(path, x, 0);

    return path;
  }

  translate_path(path, x, y) {
    path.forEach(function(part, index) {
      this[index][0] += x;
      this[index][1] += y;
    }, path);
    return path;
  }
}