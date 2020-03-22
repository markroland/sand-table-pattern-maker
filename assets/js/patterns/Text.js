class Text {

  constructor() {

    this.key = "text";

    this.name = "Text";

    this.char_width = 1.5 * ball_size;
    this.char_height = this.char_width * 2;
    this.line_height = 2 * this.char_height;

    this.config = {
      "height": {
        "name": "Line Height",
        "value": this.char_height,
        "input": {
          "type": "createSlider",
          "params" : [
            10,
            80,
            this.char_height,
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

  draw() {

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    let path = new Array();

    // Update object
    this.char_height = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.text.value = document.querySelector('#pattern-controls > div:nth-child(2) > textarea').value;

    // Display
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.char_height + " " + units;

    // Return single-point path if string is empty
    // This prevents the main "draw" function from breaking
    if (this.config.text.value < 1) {
      path = [[0,0]];
      return path;
    }

    // Split string by line
    let lines = this.config.text.value.split("\n");
    let x = 0;
    let y = 0;
    let text_height = this.char_height;

    // Loop through lines and split by comma
    for (var i = 0; i < lines.length; i++) {

      // Loop through text string and build each character
      let j_max = lines[i].length;

      for (var j = 0; j < j_max; j++) {

        // Get the path for the current character
        path = path.concat(this.draw_character(x, y, lines[i].charAt(j)));

        // Increment the x position by the character width
        x += this.char_width;

        // Add connector if not the last letter
        if (j != (j_max-1)) {
          x += (0.4 * this.char_width);
          path = path.concat([[x, y]]);
        }
      }

      // Start a new line
      if (i < lines.length-1) {
        path = path.concat([
          [x, y + -0.5 * this.char_height],
          [-this.char_width/2, y + -0.5 * this.char_height],
          [-this.char_width/2, y - this.line_height]
        ]);
        x = 0;
        y -= this.line_height;
      }

    }

    // Center path
    var text_width = Math.max(...path.map(function(value, index) { return value[0]; }));
    path = this.translate_path(path, -text_width/2, -this.char_height/2 + ((lines.length-1) * this.line_height)/2);

    return path;
  }

  draw_character(x, y, character) {

    // Initialize path
    let path = new Array();

    // Shorten variables
    let height = this.char_height;
    let width = this.char_width;

    // Convert to upper case
    character = character.toUpperCase();

    // Character definitions
    switch(character) {
      case " ":
        path = [
          [1.0, 0]
        ];
        break;
      case "\n":
        path = [];
        break;
      case "A":
        path = [
          [0, 0],
          [0.5, 1.0],
          [0.75, 0.5],
          [0.25, 0.5],
          [0.75, 0.5],
          [1.0, 0]
        ];
        break;
      case "B":
        path = [
          [0, 0],
          [0, 1.0],
          [0.75, 1.0],
          [1.0, 0.875],
          [1.0, 0.625],
          [0.75, 0.5],
          [0, 0.5],
          [0.75, 0.5],
          [1.0, 0.325],
          [1.0, 0.125],
          [0.75, 0],
          [0, 0]
        ];
        break;
      case "C":
        path = [
          [0, 0],
          [0.25, 0],
          [0, 0.25],
          [0, 0.75],
          [0.25, 1.0],
          [0.75, 1.0],
          [1.0, 0.75],
          [0.75, 1.0],
          [0.25, 1.0],
          [0, 0.75],
          [0, 0.25],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.25],
          [0.75, 0]
        ];
        break;
      case "D":
        path = [
          [0, 0],
          [0, 1.0],
          [0.25, 1.0],
          [0.75, 1.0],
          [1.0, 0.75],
          [1.0, 0.25],
          [0.75, 0],
          [0, 0],
          [0.75, 0]
        ];
        break;
      case "E":
        path = [
          [0, 0],
          [0, 1.0],
          [1.0, 1.0],
          [0, 1.0],
          [0, 0.5],
          [1.0, 0.5],
          [0, 0.5],
          [0, 0],
          [1.0, 0]
        ];
        break;
      case "F":
        path = [
          [0, 0],
          [0, 1.0],
          [1.0, 1.0],
          [0, 1.0],
          [0, 0.5],
          [1.0, 0.5],
          [0, 0.5],
          [0, 0]
        ];
        break;
      case "G":
        path = [
          [0, 0],
          [0.25, 0],
          [0, 0.25],
          [0, 0.75],
          [0.25, 1.0],
          [0.75, 1.0],
          [1.0, 0.75],
          [0.75, 1.0],
          [0.25, 1.0],
          [0, 0.75],
          [0, 0.25],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.25],
          [1.0, 0.5],
          [0.75, 0.5],
          [1.0, 0.5],
          [1.0, 0.25],
          [0.75, 0]
        ];
        break;
      case "H":
        path = [
          [0, 0],
          [0, 1.0],
          [0, 0.5],
          [1.0, 0.5],
          [1.0, 1.0],
          [1.0, 0]
        ];
        break;
      case "I":
        path = [
          [0.25, 0],
          [0.5, 0],
          [0.5, 1.0],
          [0.25, 1.0],
          [0.75, 1.0],
          [0.5, 1.0],
          [0.5, 0],
          [0.25, 0]
        ];
        break;
      case "J":
        path = [
          [0, 0],
          [0, 0.25],
          [0, 0],
          [1.0, 0],
          [1.0, 1.0],
          [0.75, 1.0],
          [1.0, 1.0],
          [1.0, 0]
        ];
        break;
      case "K":
        path = [
          [0, 0],
          [0, 1.0],
          [0, 0.5],
          [1.0, 1.0],
          [0, 0.5],
          [1.0, 0],
        ];
        break;
      case "L":
        path = [
          [0, 0],
          [0, 1.0],
          [0, 0],
          [1.0, 0]
        ];
        break;
      case "M":
        path = [
          [0, 0],
          [0, 1.0],
          [0.5, 0.5],
          [1.0, 1.0],
          [1.0, 0]
        ];
        break;
      case "N":
        path = [
          [0, 0],
          [0, 1.0],
          [1.0, 0],
          [1.0, 1.0],
          [1.0, 0]
        ];
        break;
      case "O":
        path = [
          [0, 0],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.25],
          [1.0, 0.75],
          [0.75, 1.0],
          [0.25, 1.0],
          [0, 0.75],
          [0, 0.25],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0]
        ];
        break;
      case "P":
        path = [
          [0, 0],
          [0, 1.0],
          [0.75, 1.0],
          [1.0, 0.875],
          [1.0, 0.625],
          [0.75, 0.5],
          [0, 0.5],
          [0, 0]
        ];
        break;
      case "Q":
        path = [
          [0, 0],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.25],
          [1.0, 0.75],
          [0.75, 1.0],
          [0.25, 1.0],
          [0, 0.75],
          [0, 0.25],
          [0.25, 0],
          [0.75, 0],
          [0.5, 0.25],
          [1.0, -0.25],
          [0.75, 0],
          [1.0, 0]
        ];
        break;
      case "R":
        path = [
          [0, 0],
          [0, 1.0],
          [0.75, 1.0],
          [1.0, 0.875],
          [1.0, 0.625],
          [0.75, 0.5],
          [0, 0.5],
          [0.75, 0.5],
          [1.0, 0]
        ];
        break;
      case "S":
        path = [
          [0.25, 0],
          [0, 0.125],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.125],
          [1.0, 0.325],
          [0.75, 0.5],
          [0.25, 0.5],
          [0, 0.625],
          [0, 0.875],
          [0.25, 1.0],
          [0.75, 1.0],
          [1.0, 0.875],
          [0.75, 1.0],
          [0.25, 1.0],
          [0, 0.875],
          [0, 0.625],
          [0.25, 0.5],
          [0.75, 0.5],
          [1.0, 0.325],
          [1.0, 0.125],
          [0.75, 0],
        ];
        break;
      case "T":
        path = [
          [0, 0],
          [0.5, 0],
          [0.5, 1.0],
          [0, 1.0],
          [1.0, 1.0],
          [0.5, 1.0],
          [0.5, 0]
        ];
        break;
      case "U":
        path = [
          [0, 0],
          [0.25, 0],
          [0, 0.25],
          [0, 1.0],
          [0, 0.25],
          [0.25, 0],
          [0.75, 0],
          [1.0, 0.25],
          [1.0, 1.0],
          [1.0, 0.25],
          [0.75, 0]
        ];
        break;
      case "V":
        path = [
          [0, 0],
          [0.5, 0],
          [0, 1.0],
          [0.5, 0],
          [1.0, 1.0],
          [0.5, 0]
        ];
        break;
      case "W":
        path = [
          [0, 0],
          [0, 1.0],
          [0, 0],
          [0.5, 0.5],
          [1.0, 0],
          [1.0, 1.0],
          [1.0, 0]
        ];
        break;
      case "X":
        path = [
          [0, 0],
          [0.5, 0.5],
          [0, 1.0],
          [0.5, 0.5],
          [1.0, 1.0],
          [0.5, 0.5],
          [1.0, 0]
        ];
        break;
      case "Y":
        path = [
          [0, 0],
          [0.5, 0],
          [0.5, 0.5],
          [0, 1.0],
          [0.5, 0.5],
          [1.0, 1.0],
          [0.5, 0.5],
          [0.5, 0]
        ];
        break;
      case "Z":
        path = [
          [0, 0],
          [1.0, 1.0],
          [0, 1.0],
          [1.0, 1.0],
          [0, 0],
          [1.0, 0]
        ];
        break;
      default:
        path = [
          [0, 0],
          [0, 1.0],
          [1.0, 1.0],
          [1.0, 0],
          [0, 0],
          [1.0, 0]
        ];
    }

    // Scale character
    path.forEach(function(coordinate, index, path) {
      path[index][0] = coordinate[0] * this.char_width;
      path[index][1] = coordinate[1] * this.char_height;
    }, this);

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