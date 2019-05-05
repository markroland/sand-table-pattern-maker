/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupCycloid()
{

  // Radius A - Fixed circle
  radius_a_div = createDiv('<label>Fixed Radius (A)</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  radius_a = createSlider(1, floor(0.5 * min(max_x,max_y)), 30, 1)
    .parent(radius_a_div);
  radius_a_value = createSpan('0');
  radius_a_value.parent(radius_a_div);

  // Radius B - Moving Circle
  // Positive value -> Cycloid
  // Negative value -> Epicycloid (?)
  radius_b_div = createDiv('<label>Moving Radius (B)</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  // radius_b = createSlider(1, floor(0.5 * min(max_x,max_y)), 30, 1)
  radius_b = createSlider(-floor(0.5 * min(max_x,max_y)), -1, -floor(0.25 * min(max_x,max_y)), 1)
    .parent(radius_b_div);
  radius_b_value = createSpan('0');
  radius_b_value.parent(radius_b_div);

  // Twist controls
  arm_length_div = createDiv('<label>Arm Length</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  arm_length = createSlider(1, 0.5 * min(max_x,max_y), floor(0.25 * min(max_x,max_y)), 1)
    .parent(arm_length_div);
  arm_length_value = createSpan('0');
  arm_length_value.parent(arm_length_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawCycloid()
{

  // Draw control selection values
  radius_a_value.html(radius_a.value());
  radius_b_value.html(radius_b.value());
  arm_length_value.html(arm_length.value());

  // Circle at center
  path = calcCycloid(
    radius_a.value(),
    radius_b.value(),
    arm_length.value()
  );

  return path;
}

/**
 * Calculate coordinates for a Cycloid
 *
 * http://xahlee.info/SpecialPlaneCurves_dir/EpiHypocycloid_dir/epiHypocycloid.html
 **/
function calcCycloid(radius_a, radius_b, arm_length) {

  // Set initial values
  var x;
  var y;
  var theta = 0;

  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter
  var step = 0;

  // Set the step multiplication factor. A value of 1 will increase theta
  // by 1-degree. A value of 10 will result in theta increasing by
  // 10-degrees for each drawing loop. A larger number results in fewer
  // instructions (and a faster drawing), but at lower curve resolution.
  // A small number has the best resolution, but results in a large instruction
  // set and slower draw times. 10 seems to be a good balance.
  var step_scale = 10;

  // Calculate the period of the Cycloid
  // It is 2-Pi times the result of the rolling circle's radius divided by the
  // Greatest Common Divisor of the two circle radii.
  // https://www.reddit.com/r/math/comments/27nz3l/how_do_i_calculate_the_periodicity_of_a/
  var cycloid_period = abs(radius_b / gcd(parseInt(radius_a), parseInt(radius_b))) * TWO_PI;

  // Continue as long as the design stays within bounds of the plotter
  while (theta < cycloid_period) {

    // Calculate theta offset for the step
    theta = radians(step_scale * step);

    // Cycloid parametric equations
    x = (radius_a + radius_b) * cos(theta) + arm_length * cos(((radius_a + radius_b)/radius_b) * theta);
    y = (radius_a + radius_b) * sin(theta) + arm_length * sin(((radius_a + radius_b)/radius_b) * theta);

    // Add coordinates to shape array
    path[step] = [x,y];

    // Increment iteration counter
    step++;
  }

  return path;
}

/**
 * Calculate the Greatest Common Divisor (or Highest Common Factor) of 2 numbers
 *
 * https://en.wikipedia.org/wiki/Greatest_common_divisor
 * https://www.geeksforgeeks.org/c-program-find-gcd-hcf-two-numbers/
 */
function gcd(a, b) {
  if (b == 0)
    return a;
  return gcd(b, a % b);
}
