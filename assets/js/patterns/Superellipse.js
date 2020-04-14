/*
 * Super Ellipse
 *
 * https://en.wikipedia.org/wiki/Superellipse
 * https://mathworld.wolfram.com/Superellipse.html
 * https://thecodingtrain.com/CodingChallenges/019-superellipse.html
 *
 */
class Superellipse {

  constructor() {

    this.key = "superellipse";

    this.name = "Superellipse";

    let max_r = Math.min((max_x - min_x), (max_y - min_y))/2;

    this.config = {
      "width": {
        "name": "Width",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            0.5 * (max_x - min_x),
            max_r,
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
            0,
            0.5 * (max_y - min_y),
            max_r,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "n": {
        "name": "n-value",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0.1,
            10,
            1.5,
            0.1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "spiralize": {
        "name": "Spiralize",
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

  draw() {

    // Update object
    this.config.width.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.height.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.n.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.spiralize.value = false;
    if (document.querySelector('#pattern-controls > div:nth-child(4) > input[type=checkbox]').checked) {
      this.config.spiralize.value = true;
    }


    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.width.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.height.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.n.value;

    // Calculate path
    let path = this.calc(
      this.config.width.value,
      this.config.height.value,
      this.config.n.value,
      this.config.spiralize.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for a Superellipse
   *
   * @param float width
   * @param float height
   * @param float n
   * @param float spiralize
   *
   **/
  calc(width, height, n, spiralize) {

    // Set initial values
    var x;
    var y;
    var a = width;
    var b = height;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // The number of "sides"
    // A larger number makes the shape more smooth
    let sides = 60;

    if (spiralize) {
      a = 0;
      b = 0;
      var n_base = n;
      var max_loops = 30;
      for (var loop = 0; loop < max_loops; loop++) {
        var a_base = (loop / max_loops) * width;
        var b_base = (loop / max_loops) * height;
        n = (loop / max_loops) * n_base + 0.1;
        for (var theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / sides) {
          a = a_base + (theta/(2 * Math.PI)) * (width/max_loops)
          b = b_base + (theta/(2 * Math.PI)) * (height/max_loops)
          x = Math.pow(Math.abs(Math.cos(theta)), (2/n)) * a * this.sgn(Math.cos(theta));
          y = Math.pow(Math.abs(Math.sin(theta)), (2/n)) * b * this.sgn(Math.sin(theta));
          path.push([x,y]);
        }
      }
    } else {

      // Loop through one revolution
      for (var theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / sides) {
        x = Math.pow(Math.abs(Math.cos(theta)), (2/n)) * a * this.sgn(Math.cos(theta));
        y = Math.pow(Math.abs(Math.sin(theta)), (2/n)) * b * this.sgn(Math.sin(theta));
        path.push([x,y]);
      }
    }

    return path;
  }

  /**
   * Return +1 if the number is positive, -1 if the number is negative, and 0 if zero
   */
  sgn(val) {
    if (val == 0) {
      return 0;
    }
    return val / Math.abs(val);
  }
}