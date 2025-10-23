import PathHelper from '@markroland/path-helper'
import * as Utilities from './utils/Utilities.js';
import Easing from './utils/Easing.js';

/**
 * Fibonacci
 */
class Fibonacci {

  constructor(env) {

    this.key = "fibonacci";

    this.name = "Fibonacci";

    this.env = env;

    this.config = {
      "points": {
        "name": "Points",
        "value": null,
        "input": {
          "type": "createSlider",
          "params" : [
            100,
            2000,
            500,
            100
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "easing": {
        "name": "Easing",
        "value": null,
        "input": {
          "type": "createSelect",
          "options": {
            "linear": "linear",
            "easeInSine": "easeInSine",
            "easeOutSine": "easeOutSine",
            "easeInOutSine": "easeInOutSine",
            "easeInQuad": "easeInQuad",
            "easeOutQuad": "easeOutQuad",
            "easeInOutQuad": "easeInOutQuad",
            "easeInCubic": "easeInCubic",
            "easeOutCubic": "easeOutCubic",
            "easeInOutCubic": "easeInOutCubic",
            "easeInQuart": "easeInQuart",
            "easeOutQuart": "easeOutQuart",
            "easeInOutQuart": "easeInOutQuart",
            "easeInQuint": "easeInQuint",
            "easeOutQuint": "easeOutQuint",
            "easeInOutQuint": "easeInOutQuint",
            "easeInExpo": "easeInExpo",
            "easeOutExpo": "easeOutExpo",
            "easeInOutExpo": "easeInOutExpo",
            "easeInCirc": "easeInCirc",
            "easeOutCirc": "easeOutCirc",
            "easeInOutCirc": "easeInOutCirc"
          }
        }
      },
      "transition": {
        "name": "Transition",
        "value": null,
        "input": {
          "type": "createSelect",
          "options": {
            "direct": "Direct",
            "center": "Center",
            "bezier": "Bezier Curve",
            "arc": "Arc"
          }
        }
      },
      "sort": {
        "name": "Sort Points",
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
    this.config.points.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.easing.value = document.querySelector('#pattern-controls > div:nth-child(2) > select').value;
    this.config.transition.value = document.querySelector('#pattern-controls > div:nth-child(3) > select').value;
    this.config.sort.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').checked;

    // Patterns[selected_pattern].config.reverse.value = document.querySelector('#pattern-controls input[name=reverse]').checked;

    // Display selected values
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.points.value;

    // Calculate the path
    let path = this.createFloret(
      Math.min(this.env.table.x.max - this.env.table.x.min, this.env.table.y.max - this.env.table.y.min) / 2,
      this.config.points.value,
      this.config.easing.value,
      this.config.transition.value,
      this.config.sort.value
    );

    // Update object
    this.path = path;

    return path;
  }

  /*
  * Draw Fibonacci Spiral Spokes
  *
  * Type: Radial
  **/
  createFloret(radius, points, easing, transition, sort)
  {

    const PathHelp = new PathHelper();

    const ball_size = this.env.ball.diameter;

    let path = [];

    const r_max = radius;

    // Calculate the number of iterations required to decay
    // to a minimum value;
    const r_min = ball_size / 2;

    let unsortedPoints = [];

    // Loop through iterations to generate points
    const i_min = 0;
    const i_max = points;
    // for (let i = 0; i <= i_max - 1; i++) {
    for (let i = i_max; i >= i_min; i--) {

      // let theta = i * Math.PI * (3.0 - Math.sqrt(5));

      let theta = (i_max - i) * Math.PI * (3.0 - Math.sqrt(5));

      let r;
      if (easing == "linear") {
        r = PathHelp.map(i, i_max, i_min, r_max, r_min);
      } else {
        r = (r_max) * (1 - Easing[easing]((i_max - i) / (i_max - i_min)));
      }

      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);

      unsortedPoints.push([x, y]);
    }

    // Sort the points optimally
    let sortedPoints = [];
    if (sort) {
      sortedPoints = this.sortFloret(unsortedPoints, 30);
    } else {
      sortedPoints = unsortedPoints;

    }

    // Now build the path with transitions
    for (let i = 0; i < sortedPoints.length; i++) {
      const point = sortedPoints[i];

      if (transition == "arc" && path.length > 0) {
        path = path.concat(
          this.transition(
            path[path.length - 1],
            point,
            3
          )
        );
      } else if (transition == "bezier" && path.length > 0) {
        path = path.concat(
          this.transition(
            path[path.length - 1],
            point,
            2
          )
        );
      } else if (transition == "center") {

        path.push([0, 0]);
      }

      path.push(point);
    }

    // Always end in center
    path.push([0,0]);

    return path;
  }

  /**
   * Sort the points in a Fibonacci Spiral in order to draw them
   * more efficiently
   * @param {*} points - Points representing a Fibonacci spiral, typically
   * provided in order of least to greatest Radius
   * @param {*} maxDistance - The maximum distance that next points in the
   * sorting order should be considered from the current point
   * @returns
   */
  sortFloret(points, maxDistance = Infinity) {

    if (points.length === 0) {
      return [];
    }

    // Calculate radius for each point and create objects with index
    const pointsWithRadius = points.map((point, index) => ({
      point: point,
      radius: Math.sqrt(point[0] * point[0] + point[1] * point[1]),
      angle: Math.atan2(point[1], point[0]),
      originalIndex: index,
      visited: false
    }));

    // Sort by radius descending to get max radius groups
    pointsWithRadius.sort((a, b) => b.radius - a.radius);

    const sortedPoints = [];
    let currentPoint = null;

    while (sortedPoints.length < points.length) {
      let nextPoint = null;

      if (currentPoint === null) {
        // Start with the point with largest radius
        nextPoint = pointsWithRadius.find(p => !p.visited);
      } else {
        // Find candidates within maxDistance and in clockwise direction
        const candidatesWithinDistance = pointsWithRadius.filter(p => {
          if (p.visited) return false;

          const distance = Math.sqrt(
            (p.point[0] - currentPoint.point[0]) ** 2 +
            (p.point[1] - currentPoint.point[1]) ** 2
          );

          if (distance > maxDistance) return false;

          // Check if point is in clockwise direction
          // Calculate angle difference (clockwise is negative)
          let angleDiff = p.angle - currentPoint.angle;

          // Normalize angle difference to [-π, π]
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          // Only include points in clockwise direction (negative angle difference)
          // or very small positive differences (to handle floating point precision)
          return angleDiff <= 0.1; // Small tolerance for floating point precision
        });

        if (candidatesWithinDistance.length === 0) {
          // If no clockwise points within maxDistance, find closest unvisited point regardless of direction
          const unvisitedPoints = pointsWithRadius.filter(p => !p.visited);
          if (unvisitedPoints.length === 0) break;

          let minDistance = Infinity;
          for (const candidate of unvisitedPoints) {
            const distance = Math.sqrt(
              (candidate.point[0] - currentPoint.point[0]) ** 2 +
              (candidate.point[1] - currentPoint.point[1]) ** 2
            );

            if (distance < minDistance) {
              minDistance = distance;
              nextPoint = candidate;
            }
          }
        } else {
          // Find the maximum radius among clockwise candidates within distance
          const maxRadius = Math.max(...candidatesWithinDistance.map(p => p.radius));

          // Get all candidates with the maximum radius within distance
          const finalCandidates = candidatesWithinDistance.filter(p =>
            Math.abs(p.radius - maxRadius) < 0.001 // Use small epsilon for floating point comparison
          );

          // Among final candidates, find the one closest to current point
          let minDistance = Infinity;
          for (const candidate of finalCandidates) {
            const distance = Math.sqrt(
              (candidate.point[0] - currentPoint.point[0]) ** 2 +
              (candidate.point[1] - currentPoint.point[1]) ** 2
            );

            if (distance < minDistance) {
              minDistance = distance;
              nextPoint = candidate;
            }
          }
        }
      }

      if (nextPoint) {
        nextPoint.visited = true;
        sortedPoints.push(nextPoint.point);
        currentPoint = nextPoint;
      } else {
        break;
      }
    }

    return sortedPoints;
  }

  /**
   * Transition between two points using different methods
   * @param {*} p1
   * @param {*} p2
   * @param {*} option - 1) "spike" 2) "curve" 3) "spoke"
   * @returns
   */
  transition(p1, p2, option) {

    let transitionPath = [];

    const PathHelp = new PathHelper();

    if (option == 1) {

      const midpoint = PathHelp.midpoint(p1, p2);

      const theta = Math.atan2(midpoint[1], midpoint[0]);
      const r = Math.sqrt(midpoint[0] ** 2 + midpoint[1] ** 2);
      const r_factor = 0.5;

      const point = [
        r_factor * r * Math.cos(theta),
        r_factor * r * Math.sin(theta)
      ];

      transitionPath.push(point);

    } else if (option == 2) {

      let handle_option = 0;

      if (this.config.sort.value) {
        handle_option = 1;
      }

      // Option 1: Set handle at center
      let handle = [0, 0];

      // Option 2: Set handle halfway to center
      if (handle_option == 1) {

        let mid_theta = this.averageAngles(Math.atan2(p1[1], p1[0]), Math.atan2(p2[1], p2[0]));

        let mid_radius = (Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1]) + Math.sqrt(p2[0] * p2[0] + p2[1] * p2[1])) / 2;

        // let radius = Math.max(10, 0.75 * mid_radius);
        let radius = 0.75 * mid_radius;

        handle = [
          radius * Math.cos(mid_theta),
          radius * Math.sin(mid_theta)
        ];
      }

      // Option 3: Set the handle point to be perpendicular to the midpoint of
      // p1 and p2
      if (handle_option == 2) {
        const midpoint = PathHelp.midpoint(p1, p2);
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];

        // Perpendicular direction (normalize)
        const length = Math.sqrt(dx * dx + dy * dy);
        const perp = [-dy / length, dx / length];

        // Offset by 20 units from the midpoint
        const offset = (Math.min(40, Math.sqrt(p2[0] * p2[0] + p1[0] * p1[0])));

        handle = [
          midpoint[0] + perp[0] * offset,
          midpoint[1] + perp[1] * offset
        ];
      }

      let bezier = PathHelp.quadraticBezierPath(p1, handle, p2, 10);

      bezier = bezier.slice(1, -1);
      transitionPath = bezier;

    } else if (option == 3) {

      const p1_r = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1]);
      const p1_theta = Math.atan2(p1[1], p1[0]);

      const p1_prime_r = p1_r - 2 * this.env.ball.diameter;
      const p1_prime = [
        p1_prime_r * Math.cos(p1_theta),
        p1_prime_r * Math.sin(p1_theta)
      ];


      const p2_r = Math.sqrt(p2[0] * p2[0] + p2[1] * p2[1]);
      const p2_theta = Math.atan2(p2[1], p2[0]);

      const p2_prime_r = p2_r - 2 * this.env.ball.diameter;
      const p2_prime = [
        p2_prime_r * Math.cos(p2_theta),
        p2_prime_r * Math.sin(p2_theta)
      ];

      // Arc
      // transitionPath = [
      //   ...Utilities.arcBetweenPoints(...p1_prime, ...p2_prime, this.env.ball.diameter),
      //   p2_prime
      // ];

      transitionPath = transitionPath.concat(
        Utilities.polarTransition(p1_theta, p2_prime_r, p2_theta, p2_prime_r, true, 12)
      );
    }

    return transitionPath;
  }

  /**
   * Compute the average between two angles in Radians
   * @param {*} theta1
   * @param {*} theta2
   * @returns
   */
  averageAngles(theta1, theta2) {

    // Convert angles to unit vectors
    const x1 = Math.cos(theta1);
    const y1 = Math.sin(theta1);
    const x2 = Math.cos(theta2);
    const y2 = Math.sin(theta2);

    // Average the vectors
    const avgX = (x1 + x2) / 2;
    const avgY = (y1 + y2) / 2;

    // Convert back to angle
    return Math.atan2(avgY, avgX);
  }
}

export default Fibonacci;