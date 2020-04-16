/**
 * Star
 */
class Star {

  constructor() {

    this.key = "star";

    this.name = "Star";

    this.config = {
      "points": {
        "name": "Points",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            2,
            12,
            5,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "pointiness": {
        "name": "Pointiness",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            1,
            0.5,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "revolutions": {
        "name": "Revolutions",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            60,
            20,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "twist": {
        "name": "Twist",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -1,
            1,
            0,
            0.01
          ],
          "class": "slider",
          "displayValue": true
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

    // Read in selected value(s)
    this.config.points.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.pointiness.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.revolutions.value = parseInt(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.twist.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.points.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.pointiness.value.toFixed(2);
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.revolutions.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.twist.value.toFixed(2) + " Revs";

    // Calculate path
    let path = this.calc(
        0,
        0,
        0,
        0,
        this.config.revolutions.value,
        this.config.points.value,
        this.config.pointiness.value,
        this.config.twist.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @param integer Revolutions
   *
   * @return Array Path
   **/
  calc(start_x, start_y, start_r, start_theta, revolutions, points, pointiness, twist) {

    // Set initial values
    var x;
    var y;
    var r = start_r;
    var theta = start_theta;

    // Initialize shape path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Calculate the maximum radius
    var max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

    // Loop through revolutions
    var sides = 2 * points;
    var i_max = sides * revolutions;
    var theta_max = (2 * Math.PI) * revolutions;
    var theta_twist;
    for (var i = 0; i <= i_max; i++) {

      // Rotational Angle
      theta_twist = ((i_max - i) / i_max) * twist * (2 * Math.PI);
      theta = (i/i_max) * theta_max - theta_twist;

      // Increment radius
      r = start_r + (1 - ((i % 2) * pointiness)) * (max_r * (i/i_max));

      // Convert polar position to rectangular coordinates
      x = start_x + (r * Math.cos(theta));
      y = start_y + (r * Math.sin(theta));

      // Add coordinates to shape array
      path.push([x,y]);
    }

    return path;
  }
}