/*
 * Farris Curve
 * http://www.quantamagazine.org/how-to-create-art-with-mathematics-20151008
 * http://www.sineofthetimes.org/the-art-of-parametric-equations-2/
*/
class Farris {

  constructor() {

    this.key = "farris";

    this.name = "Farris Curve";

    this.path_sampling_optimization = 2;

    // Define the parametric equations using text inputs
    this.config = {
      "A": {
        "name": "A Coefficient",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            20,
            1,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "B": {
        "name": "B Coefficient",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            20,
            6,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "C": {
        "name": "C Coefficient",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            20,
            14,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "scale": {
        "name": "Scale",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0,
            100,
            25,
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
      }
    };

    this.path = [];
  }

  draw() {

    // Update object
    this.config.A.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.B.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.C.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.scale.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;
    this.config.rotation.value = document.querySelector('#pattern-controls > div:nth-child(5) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.A.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.B.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.C.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.scale.value + "%";
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.rotation.value + "°";

    let path = this.calc(
      Math.min((max_x - min_x), (max_y - min_y)),
      parseFloat(this.config.A.value),
      parseFloat(this.config.B.value),
      parseFloat(this.config.C.value),
      parseFloat(this.config.scale.value),
      parseFloat(this.config.rotation.value)
    );

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(radius, A, B, C, scale, rotation) {

    // Set initial values
    var x;
    var y;
    var theta = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // Set period of full rotation
    let period = 2 * Math.PI;

    // Set the steps per revolution. Oversample and small distances can be optimized out afterward
    let steps_per_revolution = 1000;

    // Loop through one revolution
    while (theta < period) {

      // Rotational Angle (steps per rotation in the denominator)
      theta = (step/steps_per_revolution) * period

      // Run the parametric equations
      x = (scale/100) * radius * (Math.cos(A*theta) + Math.cos(B*theta)/2 + Math.sin(C*theta)/3);
      y = (scale/100) * radius * (Math.sin(A*theta) + Math.sin(B*theta)/2 + Math.cos(C*theta)/3);

      // Add coordinates to shape array
      path.push([x,y]);

      // Increment iteration counter
      step++;
    }

    // Rotate
    // Every pattern is "rotated" by 12.5 degrees at Theta=0.
    // I'm applying a base rotation so the pattern starts on the X-axis
    rotation = rotation - Math.atan2(1/3, 1.5) * 180 / Math.PI;
    path = path.map(function(element) {
        return this.rotationMatrix(element[0], element[1], rotation * (Math.PI/180))
    }, this);

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