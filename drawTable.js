function drawTable() {
  // Draw table surface
  noStroke();
  fill(220, 220, 220);
  ellipse(width/2, height/2, 648, 648);

  // Draw plottable area
  rectMode(CENTER);
  fill(215, 215, 215);
  rect(width/2, height/2, max_x, max_y);
  
  // Draw crosshairs
  //*
  stroke(200);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
  noStroke();
  //*/
}
