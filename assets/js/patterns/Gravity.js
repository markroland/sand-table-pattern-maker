/*
 * Gravity Pattern
 * Inspired by Daniel Shiffman's "Nature of Code"
 */
class Gravity {

  constructor() {

    this.key = "gravity";

    this.name = "Gravity";

    this.config = {
      "steps": {
        "name": "Iteration Steps",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            1000,
            10000,
            2000,
            100
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "A1m": {
        "name": "Attractor Mass",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            0.1,
            100,
            50,
            0.0001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "xp0": {
        "name": "X0 Position",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -(max_x - min_x) / 2,
            (max_x - min_x) / 2,
            0,
            1.0
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "yp0": {
        "name": "Y0 Position",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -(max_y - min_y) / 2,
            (max_y - min_y) / 2,
            0,
            0.1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "xv0": {
        "name": "X0 Velocity",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -20,
            20,
            5,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "yv0": {
        "name": "Y0 Velocity",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            -20,
            20,
            5,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      }
    };

    this.path = [];

    this.movers;
    this.attractors = [];

  }

  draw() {

    // Update object
    this.config.steps.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(1) > input').value);
    this.config.A1m.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(2) > input').value);
    this.config.xp0.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(3) > input').value);
    this.config.yp0.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(4) > input').value);
    this.config.xv0.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(5) > input').value);
    this.config.yv0.value = parseFloat(document.querySelector('#pattern-controls > div:nth-child(6) > input').value);

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.steps.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.A1m.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.xp0.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.yp0.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.xv0.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(6) > span').innerHTML = this.config.yv0.value;

    // Define the Mover object - this represents the ball
    // The "mass" on this appears to have no impact on the path
    this.mover = new Mover(
      10,
      this.config.xp0.value,
      this.config.yp0.value,
      this.config.xv0.value,
      this.config.yv0.value
    );

    // Define the Attractor objects that the Mover object is attracted toward
    this.attractors[0] = new Attractor(1, this.config.A1m.value, -100, 0);
    this.attractors[1] = new Attractor(1, this.config.A1m.value, 100, 0);

    // Calculate path
    let path = this.calc(
      this.config.steps.value
    );

    return path;
  }

  /**
   * Calculate coordinates
   **/
  calc(steps) {

    let path = new Array();
    let point = new Array();
    let force = new p5.Vector(0, 0);
    // let forces = new Array();
    // let attractor_force = new p5.Vector(0, 0);
    let force1;
    let force2;

    // Loop through an arbitrary number of time iterations
    for (var i = 0; i < steps; i++) {

      // Sum the forces of the Attractors
      // This didn't work
      /*
      for (var j = 0; j < this.attractors.length; j++) {
        attractor_force = this.attractors[j].calculateAttraction(this.mover, 5, 20);
        force = p5.Vector.add(force, attractor_force);
      }
      //*/
      force1 = this.attractors[0].calculateAttraction(this.mover, 5, 20);
      force2 = this.attractors[1].calculateAttraction(this.mover, 5, 20);
      force = p5.Vector.add(force1, force2);

      // Apply the force to the Mover
      this.mover.applyForce(force);

      // Update the position, velocity and acceleration of the mover
      this.mover.update();

      // Save the Mover position to a Path position
      point = [
        this.mover.position.x,
        this.mover.position.y
      ];

      // Add the position to the Path if it is within the bounds of the table
      if ((point[0] > -(max_x - min_x)/2 && point[0] < (max_x - min_x)/2)
        && (point[1] > -(max_y - min_y)/2 && point[1] < (max_y - min_y)/2)) {
        path.push(point);
      }
    }

    return path;
  }
}

/*
 * Attractor Class
 * Credit to Daniel Shiffman (Nature of Code)
 * Reference Sketch: https://editor.p5js.org/jcponce/sketches/OTt5ZZqT9
 */
class Attractor {

  constructor(G, m, x, y) {
    this.position = new p5.Vector(x,y);
    this.mass = m;
    this.G = G;
  }

  calculateAttraction(mover, min_distance = 5, max_distance = 20) {

    // Calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);

    // Distance between objects
    let distance = force.mag();

    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, min_distance, max_distance);

    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    force.normalize();

    // Calculate gravitional force magnitude
    let strength = (this.G * this.mass * mover.mass) / (distance * distance);

    // Get force vector --> magnitude * direction
    force.mult(strength);

    return force;
  }
}

/*
 * Mover Class
 * Credit to Daniel Shiffman (Nature of Code)
 * Reference Sketch: https://editor.p5js.org/jcponce/sketches/OTt5ZZqT9
 */
class Mover {

  constructor(m, x, y, vx, vy) {
    this.mass = m;
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(vx, vy);
    this.acceleration = new p5.Vector(0, 0);
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.add(acceleration);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
}
