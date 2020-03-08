/*
Draw Path

*/
function drawPath(path, pathWidth = 1, connected = true, animated = true) {

  noFill();
  stroke(128, 164, 200);
  strokeCap(ROUND);
  strokeWeight(pathWidth);

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

      // Gradiated Stroke
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
