function drawTable(plotter_exceeded = false) {

  let coordinate_labels = true;

  let table_radius = Math.min(max_x - min_x, max_y - min_y) / 2;

  // Draw table surface
  noStroke();
  rectMode(CENTER);
  fill(220, 220, 220);
  // ellipse(width/2, height/2, width, height);
  rect(width/2, height/2, width, height);

  // Draw plottable area
  rectMode(CENTER);
  stroke(200);
  if (plotter_exceeded) {
    stroke(255,0,0,128);
  }
  strokeWeight(1);
  fill(215, 215, 215);
  if (env.table.format == "cartesian") {
    rect(width/2, height/2, (max_x/648) * width, (max_y/648) * height);
  } else if (env.table.format == "polar") {
    ellipse(width/2, height/2, 2 * table_radius, 2 * table_radius);
  }

  // Draw crosshairs
  //*
  stroke(210);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
  noStroke();
  //*/

  // Draw Theta-Rho border
  if (env.table.format == "polar") {
    stroke(200);
    noFill();
    ellipse(width/2, height/2, min((max_x - min_x), (max_y - min_y)), min((max_x - min_x), (max_y - min_y)));

    if (coordinate_labels) {
      noStroke();
      fill(128, 128, 128)
      textAlign(LEFT);
      text("[1, 0]", width/2 + min((max_x - min_x), (max_y - min_y))/2 + 2, height/2 + 4);
      // textAlign(RIGHT);
      // text("[1,π]", width/2 - min((max_x - min_x), (max_y - min_y))/2 - 2, height/2 + 4);
      textAlign(CENTER);
      text("[1, π/2]", width/2, table_radius - 60);
    }
  }

  // Display plotter area
  if (env.table.format == "cartesian") {
    if (coordinate_labels) {
      noStroke();
      fill(128, 128, 128)
      textAlign(LEFT);
      text("[0,0]", width/2 - (max_x - min_x)/2, height/2 + (max_y - min_y)/2 + 12);
      textAlign(RIGHT);
      text("[" + max_x + "," + max_y + "]", width/2 + (max_x - min_x)/2, height/2 - (max_y - min_y)/2 - 4);
    }
  }
}
