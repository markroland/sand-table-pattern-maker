class Text {

  constructor() {

    this.key = "text";

    this.name = "Text";

    this.line_height = 40;
    this.char_width = this.line_height / 2;

    this.config = {
      "height": {
        "name": "Line Height",
        "value": 40,
        "input": {
          "type": "createSlider",
          "params" : [
            10,
            80,
            40,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "text": {
        "name": "Text",
        "value": null,
        "input": {
          "type": "createTextarea",
          "attributes" : {
            "rows": 11,
            "cols": 22,
          },
          "value" : "Hello\nWorld",
          "params" : []
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
    this.line_height = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.text.value = document.querySelector('#pattern-controls > div:nth-child(2) > textarea').value;

    // Display
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.line_height + " " + units;

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
    var text_height = this.line_height;
    var line_count = 1;
    for (var i = 0; i < i_max; i++) {

      // Get the path for the current character
      path = path.concat(this.draw_character(x, y, this.config.text.value.charAt(i)));

      // Start a new line
      if (this.config.text.value.charAt(i) == "\n") {
        line_count++;
        path = path.concat([
          [x, y + -0.25 * this.line_height],
          [-this.char_width/2, y + -0.25 * this.line_height],
          [-this.char_width/2, y + -1.5 * this.line_height]
        ]);
        x = 0;
        y -= 1.5 * this.line_height;
        continue;
      }

      // Increment the x position by the character width
      x += this.char_width;

      // Add connector if not the last letter
      if (i != i_max) {
        x += (0.4 * this.char_width);
        path = path.concat([[x, y]]);
      }
    }

    // Center path
    var text_width = Math.max(...path.map(function(value, index) { return value[0]; }));
    path = this.translate_path(path, -text_width/2, -this.line_height/2 + ((line_count-1) * 1.5 * this.line_height)/2);

    return path;
  }

  draw_character(x, y, character) {

    // Initialize path
    let path = new Array();

    // Shorten variables
    let height = this.line_height;
    let width = this.char_width;

    // Convert to upper case
    character = character.toUpperCase();

    // Character definitions
    switch(character) {
      case " ":
        path = [
          [width, 0]
        ];
        break;
      case "\n":
        path = [];
        break;
      case "A":
        path = [
          [0, 0],
          [width/2, height],
          [0.75 * width, height/2],
          [0.25 * width, height/2],
          [0.75 * width, height/2],
          [width, 0]
        ];
        break;
      case "B":
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [width, height/2],
          [0, height/2],
          [width, height/2],
          [width, 0],
          [0, 0]
        ];
        break;
      case "C":
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [0, height],
          [0, 0],
          [width, 0],
          [0, 0]
        ];
        break;
      case "D":
        path = [
          [0, 0],
          [0, height],
          [width/4, height],
          [(3/4) * width, height],
          [width, (3/4) * height],
          [width, (1/4) * height],
          [(3/4) * width, 0],
          [0, 0]
        ];
        break;
      case "E":
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [0, height],
          [0, height/2],
          [width, height/2],
          [0, height/2],
          [0, 0],
          [width, 0]
        ];
        break;
      case "F":
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [0, height],
          [0, height/2],
          [width, height/2],
          [0, height/2],
          [0, 0]
        ];
        break;
      case "G":
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [0, height],
          [0, 0],
          [width, 0],
          [width, height/2],
          [width/2, height/2],
          [width, height/2],
          [width, 0],
          [0, 0]
        ];
        break;
      case "H":
        path = [
          [0, 0],
          [0, height],
          [0, height/2],
          [width, height/2],
          [width, height],
          [width, 0]
        ];
        break;
      case "I":
        path = [
          [width/2, 0],
          [width/2, height],
          [width/2, 0]
        ];
        break;
      case "J":
        path = [
          [0, 0],
          [0, height/4],
          [0, 0],
          [width, 0],
          [width, height],
          [(3/4) * width, height],
          [width, height],
          [width, 0]
        ];
        break;
      case "K":
        path = [
          [0, 0],
          [0, height],
          [0, height/2],
          [width, height],
          [0, height/2],
          [width, 0],
        ];
        break;
      case "L":
        path = [
          [0, 0],
          [0, height],
          [0, 0],
          [width, 0]
        ];
        break;
      case "M":
        path = [
          [0, 0],
          [0, height],
          [width/2, height/2],
          [width, height],
          [width, 0]
        ];
        break;
      case "N":
        path = [
          [0, 0],
          [0, height],
          [width, 0],
          [width, height],
          [width, 0]
        ];
        break;
      case "O":
        path = [
          [width/4, 0],
          [0, height/4],
          [0, (3/4) * height],
          [width/4, height],
          [(3/4) * width, height],
          [width, (3/4) * height],
          [width, (1/4) * height],
          [(3/4) * width, 0],
          [0, 0]
        ];
        break;
      case "P":
        path = [
          [0, 0],
          [0, height],
          [(3/4) * width, height],
          [width, (7/8) * height],
          [width, (5/8) * height],
          [(3/4) * width, (1/2) * height],
          [0, (1/2) * height],
          [0, 0]
        ];
        break;
      case "Q":
        path = [
          [width/4, 0],
          [0, height/4],
          [0, (3/4) * height],
          [width/4, height],
          [(3/4) * width, height],
          [width, (3/4) * height],
          [width, (1/4) * height],
          [(3/4) * width, 0],
          [0, 0],
          [(3/4) * width, 0],
          [width, -height/4],
          [(3/4) * width, 0]
        ];
        break;
      case "R":
        path = [
          [0, 0],
          [0, height],
          [(3/4) * width, height],
          [width, (7/8) * height],
          [width, (5/8) * height],
          [(3/4) * width, (1/2) * height],
          [0, (1/2) * height],
          [(3/4) * width, (1/2) * height],
          [width, 0]
        ];
        break;
      case "S":
        path = [
          [width/4, 0],
          [0, (1/8) * height],
          [width/4, 0],
          [(3/4) * width, 0],
          [width, (1/8) * height],
          [width, (3/8) * height],
          [(3/4) * width, (1/2) * height],
          [width/4, (1/2) * height],
          [0, (5/8) * height],
          [0, (7/8) * height],
          [width/4, height],
          [(3/4) * width, height],
          [width, (7/8) * height],
          [(3/4) * width, height],
          [width/4, height],
          [0, (7/8) * height],
          [0, (5/8) * height],
          [width/4, (1/2) * height],
          [(3/4) * width, (1/2) * height],
          [width, (3/8) * height],
          [width, (1/8) * height],
          [(3/4) * width, 0],
        ];
        break;
      case "T":
        path = [
          [width/2, 0],
          [width/2, height],
          [0, height],
          [width, height],
          [width/2, height],
          [width/2, 0]
        ];
        break;
      case "U":
        path = [
          [width/4, 0],
          [0, height/4],
          [0, height],
          [0, height/4],
          [width/4, 0],
          [(3/4) * width, 0],
          [width, (1/4) * height],
          [width, height],
          [width, (1/4) * height],
          [(3/4) * width, 0]
        ];
        break;
      case "V":
        path = [
          [width/2, 0],
          [0, height],
          [width/2, 0],
          [width, height],
          [width/2, 0]
        ];
        break;
      case "W":
        path = [
          [0, 0],
          [0, height],
          [0, 0],
          [width/2, height/2],
          [width, 0],
          [width, height],
          [width, 0]
        ];
        break;
      case "X":
        path = [
          [0, 0],
          [width/2, height/2],
          [0, height],
          [width/2, height/2],
          [width, height],
          [width/2, height/2],
          [width, 0]
        ];
        break;
      case "Y":
        path = [
          [width/2, 0],
          [width/2, height/2],
          [0, height],
          [width/2, height/2],
          [width, height],
          [width/2, height/2],
          [width/2, 0]
        ];
        break;
      case "Z":
        path = [
          [0, 0],
          [width, height],
          [0, height],
          [width, height],
          [0, 0],
          [width, 0]
        ];
        break;
      default:
        path = [
          [0, 0],
          [0, height],
          [width, height],
          [width, 0],
          [0, 0],
          [width, 0]
        ];
    }

    // Move each character coordinate over
    path = this.translate_path(path, x, y);

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