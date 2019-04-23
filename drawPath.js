/*
Draw Path

*/
function drawPath(path, pathWidth = 1, connected = true) {

  stroke(128, 164, 200);
  strokeCap(ROUND);

  // Start transformation matrix
  push();
  scale(1, -1);
  translate(width/2, -height/2);

  // Draw as a continuous, connected line (stroke color cannot change)
  if (connected) {

    noFill();
    beginShape();

    for (var i = 0; i < path.length; i++) {

      // Gradiated Stroke
      stroke(128, 24 * cos((i/2000.0) * TWO_PI) + 164, 200);

      // Thicken to represent ball path
      strokeWeight(pathWidth);

      // Set vertex
      vertex(path[i][0], path[i][1]);
    }

    endShape();

  } else {

    // Draw as disconnected line segments. Stroke color can change with each segment

    for (var i = 0; i < path.length-1; i++) {

      // Gradiated Stroke
      stroke(128, 24 * cos((i/path.length) * TWO_PI) + 164, 200);

      // Thicken to represent ball path
      strokeWeight(ball_size/5);

      // Draw line segment
      line(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);

      // Draw shadows
      /*
      stroke(255, 255, 255);
      strokeWeight(1.0 * ball_size);
      line(x_prev, y_prev, x, y);

      stroke(0.8 * 255, 0.8 * 255, 0.8 * 255);
      strokeWeight(0.6 * ball_size);
      line(x_prev, y_prev, x, y);

      stroke(0.7 * 255, 0.7 * 255, 0.7 * 255);
      strokeWeight(0.3 * ball_size);
      line(x_prev, y_prev, x, y);

      stroke(0.6 * 255, 0.6 * 255, 0.6 * 255);
      strokeWeight(0.1 * ball_size);
      line(x_prev, y_prev, x, y);
      //*/

      vertex(path[i][0], path[i][1]);
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
