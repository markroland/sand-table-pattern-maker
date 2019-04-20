/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupCircle()
{

  // Clear controls
  select('#pattern-controls').html('');

  // Offset control
  angle_div = createDiv('Start Angle')
    .parent('pattern-controls')
    .addClass('pattern-control');
  angle = createSlider(0, 60, 0, 1)
    .parent(angle_div)
    .style('width', '400px');
  angle_value = createSpan('0');
  angle_value.parent(angle_div);

  // Twist controls
  radius_div = createDiv('Radius')
    .parent('pattern-controls')
    .addClass('pattern-control');
  radius = createSlider(1, 0.5 * min(max_x,max_y), 30, 0.1);
  radius.parent(radius_div);
  radius.style('width', '400px');
  radius_value = createSpan('0');
  radius_value.parent(radius_div);

  path = [[0,0]];
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawCircle()
{

  // Draw control selection values
  // angle_value.html('(' + parseInt(60 * (angle.value() / TWO_PI)) + '/60) * 2π');
  // angle_value.html('(' + angle.value() + '/60) * 2π');
  angle_value.html((angle.value() * (360/60)) + '°');
  radius_value.html(radius.value());

  // Circle at center
  //*
  path = calcCircle(
    0,
    0,
    radius.value(),
    (angle.value() / 60) * TWO_PI
  );
  //*/

  // Circle
  /*
  var start_x = 0.25 * max_x;
  var start_y = 0.25 * max_y;
  path = calcCircle(
    start_x,
    start_y,
    0.1 * min(max_x, max_y),
    atan(start_y/start_x) + PI
  );
  //*/

  return path;
}

/**
 * Calculate coordinates for a circle
 *
 * @param float start_x Starting X position (in G-code coordinates)
 * @param float start_y Starting Y position (in G-code coordinates)
 * @param float start_r Starting radius, where 0 is [x,y]
 * @param float start_theta Starting theta angle, between 0 and TWO_PI.
 *   0-degrees corresponds to the positive X direction and rotates counter clockwise
 *   (i.e. PI/2 is the positive y direction)
 * @param int rotation_direction Set 1 to move counterclockwise, -1 to move clockwise
 *
 *
 **/
function calcCircle(start_x, start_y, radius, start_theta, rotation_direction = 1) {

  // Set initial values
  var x;
  var y;
  var theta = start_theta;

  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter.
  var step = 0;

  // The number of "sides" to the circle.
  // A larger number makes the circle more smooth
  var sides = 60;

  // Continue as long as the design stays within bounds of the plotter
  while (step <= sides) {

     // Rotational Angle (steps per rotation in the denominator)
    theta = rotation_direction * (start_theta + (step/sides) * TWO_PI);

    // Convert polar position to rectangular coordinates
    x = start_x + (radius * cos(theta));
    y = start_y + (radius * sin(theta));

    // Add coordinates to shape array
    path[step] = [x,y];

    // Increment iteration counter
    step++;
  }

  return path;
}
