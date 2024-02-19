/*
Draw Path
*/
function drawPath(path, pathWidth = 1, connected = true, animated = true, showPlotter = false) {

  noFill();
  stroke(128, 164, 200);
  strokeCap(ROUND);
  strokeWeight(pathWidth);

  // Maximum radius
  max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

  // Start transformation matrix
  push();
  scale(1, -1);
  translate(width/2, -height/2);

  let i_max = path.length;
  if (animated) {
    i_max = draw_iteration % path.length;
  }

  // Draw entire path
  stroke(240, 240, 240);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i][0], path[i][1]);
  }
  endShape();

  // Represent the plotter movements
  if (showPlotter) {

    // Draw XY Plotter arms
    // triangle(30, 75, 58, 20, 86, 75);
    if (env.table.format == "cartesian") {

      // X-axis
      stroke(0,0,0,16);
      line(
        -(max_x - min_x)/2 + ball_size/2, path[i_max][1],
        (max_x - min_x)/2, path[i_max][1]
      );
      fill(0,0,0,16);
      noStroke();

      // Left Triangle
      //*
      triangle(
        -(max_x - min_x)/2, path[i_max][1] - ball_size/2,
        -(max_x - min_x)/2, path[i_max][1] + ball_size/2,
        -(max_x - min_x)/2 + ball_size/2, path[i_max][1],
      );
      //*/

      // Right Triangle
      /*
      triangle(
        (max_x - min_x)/2, path[i_max][1] - ball_size/2,
        (max_x - min_x)/2, path[i_max][1] + ball_size/2,
        (max_x - min_x)/2 - ball_size/2, path[i_max][1],
      );
      //*/

      // Y-axis
      stroke(0,0,0,16);
      line(
        path[i_max][0], (max_y - min_y)/2,
        path[i_max][0], -(max_y - min_y)/2 + ball_size/2
      );
      fill(0,0,0,16);
      noStroke();

      // Top Triangle
      /*
      triangle(
        path[i_max][0] + ball_size/2, (max_y - min_y)/2,
        path[i_max][0] - ball_size/2, (max_y - min_y)/2,
        path[i_max][0], (max_y - min_y)/2 - ball_size/2
      )
      //*/

      // Bottom Triangle
      //*
      triangle(
        path[i_max][0] + ball_size/2, -(max_y - min_y)/2,
        path[i_max][0] - ball_size/2, -(max_y - min_y)/2,
        path[i_max][0], -(max_y - min_y)/2 + ball_size/2
      )
      //*/
    }

    // Draw Radial Plotter arm
    if (env.table.format == "polar") {
      stroke(0,0,0,16);
      let arm_radius = Math.min((max_x - min_x), (max_y - min_y))/2;
      let theta = Math.atan2(path[i_max][1], path[i_max][0]);
      line(
        (arm_radius - ball_size/2) * cos(theta),
        (arm_radius - ball_size/2) * sin(theta),
        -arm_radius * cos(theta),
        -arm_radius * sin(theta),
      );
      fill(0,0,0,16);
      noStroke();
      triangle(
        (arm_radius - ball_size/2) * cos(theta), (arm_radius - ball_size/2) * sin(theta),
        arm_radius * cos(theta + (1/60) * Math.PI), arm_radius * sin(theta + (1/60) * Math.PI),
        arm_radius * cos(theta - (1/60) * Math.PI), arm_radius * sin(theta - (1/60) * Math.PI)
      );
    }

    // Coordinate display

    noStroke();
    fill(128);

    push();
    scale(1, -1);

    if (env.table.format == "cartesian") {

      // X Value
      textAlign(CENTER);
      text(
        (path[i_max][0] + ((max_x - min_x) / 2)).toFixed(1),
        path[i_max][0],
        ((max_y - min_y) / 2) + 12
      );

      // Y Value
      textAlign(RIGHT);
      text(
        (path[i_max][1] + ((max_y - min_y) / 2)).toFixed(1),
        -(((max_x - min_x) / 2) + 2),
        -(path[i_max][1] - 4)
      );
    } else if (env.table.format == "polar") {
      textAlign(LEFT);
      let rho = (Math.sqrt(Math.pow(path[i_max][0],2) + Math.pow(path[i_max][1],2)) / max_r);
      let theta = Math.atan2(path[i_max][1], path[i_max][0])
      if (theta < 0) {
        theta = theta + 2 * Math.PI;
      }

      textAlign(RIGHT);
      text(
        "rho: " + rho.toFixed(2) + "\ntheta: " + theta.toFixed(2),
        max_r,
        max_r - 40,
      );

      /*
      // Move text with arm... this is too difficult to read
      textAlign(LEFT);
      text(
        "[" + rho + ", " + theta.toFixed(2) + "]",
        (max_r * Math.cos(theta) - 30) + (45 * Math.cos(theta)),
        (-max_r * Math.sin(theta) - (12 * Math.sin(theta))) + 6,
      );
      //*/
    }
    pop();

  }

  // Draw as a continuous, connected line (stroke color cannot change)
  if (connected) {

    // Draw animated path
    stroke(46, 200, 240);
    beginShape();
    for (var i = 0; i <= i_max; i++) {
      vertex(path[i][0], path[i][1]);
    }
    endShape();

    // Draw current point
    noStroke();
    if (animated) {
      fill(255,255,0,128);
      ellipse(path[i_max][0], path[i_max][1], ball_size/2, ball_size/2);
    }

  } else {

    // Draw as disconnected line segments. Stroke color can change with each segment

    let c = color(128, 24 * cos((i/path.length) * TWO_PI) + 164, 200);

    for (var i = 0; i < i_max; i++) {

      // Background stroke
      stroke(250);
      strokeCap(SQUARE);
      strokeWeight(pathWidth*4)
      line(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);

      // Gradiated Stroke
      strokeCap(PROJECT);
      strokeWeight(pathWidth)
      stroke(c);

      // Draw line segment
      line(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);
    }

    // Draw current point
    noStroke();
    if (animated) {
      fill(c);
      ellipse(path[i_max][0], path[i_max][1], ball_size/2, ball_size/2);
    }

  }

  // Draw startpoint. Do this at the end instead of the beginning so the path does
  // cover the starting point
  noStroke();
  fill(0,255,0,128);
  ellipse(path[0][0], path[0][1], ball_size/2, ball_size/2);

  // Draw endpoint
  noStroke();
  fill(255,0,0,128);
  ellipse(path[path.length-1][0], path[path.length-1][1], ball_size/2, ball_size/2);

  // End transformation matrix
  pop();
}
