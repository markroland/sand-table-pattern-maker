/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupSpiral()
{

  // Clear controls
  select('#pattern-controls').html('');

  // Sides controls
  sides = createDiv('<label>Sides</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spiral_sides = createSlider(3, 60, 6);
  spiral_sides.parent(sides);
  sides_value = createSpan('0');
  sides_value.parent(sides);

  // Offset control
  offset = createDiv('<label>Offset</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spiral_offset = createSlider(1, 40, 20);
  spiral_offset.parent(offset);
  offset_value = createSpan('0');
  offset_value.parent(offset);

  // Twist controls
  twist_div = createDiv('<label>Twist</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spiral_twist = createSlider(1, 1.112, 1, 0.001);
  spiral_twist.parent(twist_div);
  twist_value = createSpan('0');
  twist_value.parent(twist_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawSpiral()
{

  // Draw control selection values
  sides_value.html(spiral_sides.value());
  offset_value.html(spiral_offset.value() + " " + units);
  twist_value.html(spiral_twist.value());

  // Calculate a Spiral path
  return calcSpiral(
    0,
    0,
    0,
    0,
    spiral_offset.value(),
    spiral_sides.value(),
    spiral_twist.value()
  );
}

/**
 * Calculate coordinates for a Spiral
 *
 * @param float start_x Starting X position (in G-code coordinates)
 * @param float start_y Starting Y position (in G-code coordinates)
 * @param float start_r Starting radius, where 0 is [x,y]
 * @param float start_theta Starting theta angle, between 0 and TWO_PI.
 *   0-degrees corresponds to the positive X direction and rotates counter clockwise
 *   (i.e. PI/2 is the positive y direction)
 * @param float offset This is the distance between successive loops of the spiral
 * @param integer sides This determines how many sides the spiral has. For example,
 *   if sides equals 4 then for every iteration of "step", theta will be incremented
 *   by 1/4 of 360 degrees, resulting in for samples per 360 degrees. Must be greater
 *   than 3.
 * @param float twist This is a multiplication factor for theta that modifies the
 *   angle every iteration, resulting in a "twisting" effect on the spiral
 *
 **/
function calcSpiral(start_x, start_y, start_r, start_theta, offset, sides, twist) {

  // Set initial values
  var x;
  var y;
  var r = start_r;
  var theta = start_theta;

  // Calculate the maximum radius
  var max_r = min(max_x/2, max_y/2);

  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter.
  var step = 0;

  // Continue as long as the design stays within bounds of the plotter
  // This isn't quite right yet. I need to look into the coordinate translations
  // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
  while (r < max_r) {

     // Rotational Angle (steps per rotation in the denominator)
    theta = start_theta + (step/sides) * TWO_PI;

    // Increment radius
    r = start_r + offset * (theta/TWO_PI);

    // Convert polar position to rectangular coordinates
    x = start_x + (r * cos(theta * twist));
    y = start_y + (r * sin(theta * twist));

    // Add coordinates to shape array
    path[step] = [x,y];

    // Increment iteration counter
    step++;
  }

  return path;
}
