function calcSpiral(offset, sides, twist) {

  // Calculate the maximum radius
  var max_r = min(max_x/2, max_y/2);
  
  var r = 0;
  var theta = 0;

  var x = 0;
  var y = 0;
  var x0 = x;
  var y0 = y;
  var x_prev = 0;
  var y_prev = 0;
 
  var starting_radius = 0;

  var path = new Array();

  var i = 0;
  while (r < max_r) {
    x_prev = x;
    y_prev = y;  
  
    // Rotational Angle (steps per rotation in the denominator)
    theta = (i/sides) * TWO_PI;

    // Increment radius
    r = starting_radius + offset * (theta/TWO_PI);

    // Convert polar position to rectangular coordinates
    x = r * cos(theta * twist);
    y = r * sin(theta * twist);

    path[i] = [x,y];

    // Calculate total distance traveled
    distance += sqrt(pow(x - x_prev,2) + pow(y - y_prev,2));

    i++;
  }
  
  return path; 
}
