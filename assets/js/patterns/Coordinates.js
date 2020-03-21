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
      },
      "reverse": {
        "name": "Reverse",
        "value": 0,
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

  setup() {
    return null;
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