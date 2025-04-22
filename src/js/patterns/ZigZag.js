/**
 * Zig Zag
 */
class ZigZag {

  constructor(env) {

    this.key = "zigzag";

    this.name = "Zig Zag";

    this.env = env;

    this.config = {
      "bound": {
        "name": "Bounding Shape",
        "value": null,
        "input": {
          "type": "createSelect",
          "options": {
            "rectangle": "Max Rectangle",
            "circle": "Max Circle"
          }
        }
      },
      "spacing": {
        "name": "Spacing",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -((env.table.y.max - env.table.y.min) / 2),
            -1,
            -0.5 * ((env.table.y.max - env.table.y.min) / 2),
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "margin": {
        "name": "Margin",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            Math.min(env.table.x.max - env.table.x.min, env.table.y.max - env.table.y.min)/10,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "rotation": {
        "name": "Rotation",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -180,
            180,
            0,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "border": {
        "name": "Border",
        "value": null,
        "input": {
          "type": "createCheckbox",
          "attributes" : [{
            "type" : "checkbox",
            "checked" : true
          }],
          "params": [0, 1, 0],
          "displayValue": false
        }
      },
      "reverse": {
        "name": "Reverse",
        "value": null,
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
   * Draw path - Use class's "calc" method to convert inputs to a draw path
   */
  draw() {

    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;

    // Read in selected value(s)
    this.config.bound.value = document.querySelector('#pattern-controls > div:nth-child(1) > select').value;
    this.config.spacing.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.margin.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.rotation.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);
    this.config.border.value = 0
    if (document.querySelector('#pattern-controls > div:nth-child(5) > input[type=checkbox]').checked) {
      this.config.border.value = 1
    }

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = ((max_y - min_y)/(-this.config.spacing.value)).toFixed(1) + " " + this.env.table.units;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.margin.value + " mm";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.rotation.value + "°";

    // Calculate path
    let path = this.calc(
        (max_y - min_y) / (-this.config.spacing.value),
        this.config.margin.value,
        0.0,
        this.config.border.value,
        this.config.bound.value
    );

    // Rotate
    path = path.map(function(element) {
      return this.rotationMatrix(element[0], element[1], this.config.rotation.value * (Math.PI/180))
    }, this);

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param float Spacing
   * @param float Margin
   * @param float Angle
   * @param integer Border
   *
   * @return Array Path
   **/
  calc(spacing, margin, angle, border, bounding_shape) {

    const min_x = this.env.table.x.min;
    const max_x = this.env.table.x.max;
    const min_y = this.env.table.y.min;
    const max_y = this.env.table.y.max;

    // Set initial values
    var start_x = -((max_x/2) - margin);
    var start_y = -((max_y/2) - margin);
    var x = start_x;
    var y = start_y;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Continue as long as the design stays within bounds of the plotter
    while ((y + spacing) <= ((max_y/2) - margin)) {

      if (bounding_shape == "circle") {

        if (step % 4 == 0) {
          // Move Right
          x = Math.sqrt(Math.pow(190, 2) - (Math.pow(y, 2)))
        } else if (step % 4 == 1) {
          // Move Up
          y = y + spacing;
          x = Math.sqrt(Math.pow(190, 2) - (Math.pow(y, 2)))
        } else if (step % 4 == 2) {
          // Move Left
          x = -Math.sqrt(Math.pow(190, 2) - (Math.pow(y, 2)))
        } else if (step % 4 == 3) {
          // Move Up
          y = y + spacing;
          x = -Math.sqrt(Math.pow(190, 2) - (Math.pow(y, 2)))
        }

      } else {

        // Rectangular
        if (step % 4 == 0) {
          // Move Right
          x = (max_x - min_x)/2 - margin;
        } else if (step % 4 == 2) {
          // Move Left
          x = -(max_x - min_x)/2 + margin;
        } else {
          // Move Up
          y = y + spacing;
        }
      }

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    if (border) {

      if (bounding_shape == "circle") {

        // Loop through one revolution
        for (var theta = 0.0; theta < 2 * Math.PI; theta += ((2 * Math.PI)/60)) {
          path.push([
            0.5 * (max_y - min_y) * Math.cos(theta + (0.5 * Math.PI)),
            0.5 * (max_y - min_y) * Math.sin(theta + (0.5 * Math.PI))
          ]);
        }

      } else {

        // Ends on left (min) side
        if (x < 0) {
          path.push([(max_x/2 - margin), y]);
          path.push([(max_x/2 - margin), start_y]);
          path.push([x, start_y]);
          path.push([x, y]);
        } else {
          path.push([+((max_x-min_x)/2 - margin), start_y]);
          path.push([-((max_x-min_x)/2 - margin), start_y]);
          path.push([-((max_x-min_x)/2 - margin), y]);
          path.push([x, y]);
        }
      }

    }

    return path;
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(x, y, theta) {
      return [
        x * Math.cos(theta) - y * Math.sin(theta),
        x * Math.sin(theta) + y * Math.cos(theta)
      ];
  }
}

export default ZigZag;