/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupDiameters()
{

  // Spoke controls
  spokes_div = createDiv('<label>Spokes</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spokes = createSlider(2, 60, 12, 2);
  spokes.parent(spokes_div);
  spokes_value = createSpan('0');
  spokes_value.parent(spokes_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawDiameters()
{

  // Draw control selection values
  spokes_value.html(spokes.value());

  // Calculate the path
  path = calcDiameters(spokes.value());

  return path;
}

/**
 * Diameters that cross the circle
 **/
function calcDiameters(num_spokes) {

  // Set initial values
  var x;
  var y;
  var theta = 0;

  // Calculate the maximum radius
  var max_r = min(max_x/2, max_y/2);

  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter.
  var step = 0;

  // Change in theta per step
  var theta_per_step = TWO_PI / num_spokes;

  var direction = 1;

  // Loop through 360 degrees
  while (theta < TWO_PI) {

    // Calculate new theta
    theta = floor(step/2) * theta_per_step;

    // Alternate the direction each loop, going from +x to -x
    if (step % 2 == 1) {
      direction = direction * -1;
    }
    x = direction * (min(max_x, max_y)/2);
    y = 0.0;

    // Rotate [x,y] about the center
    // https://en.wikipedia.org/wiki/Rotation_matrix
    var x_prime = x * cos(theta) - y * sin(theta);
    var y_prime = x * sin(theta) + y * cos(theta);
    x = x_prime;
    y = y_prime;

    // Add coordinates to shape array
    path[step] = [x,y];

    // Calculate total distance traveled
    if (step > 0) {
      distance += sqrt(pow(x - path[step-1][0], 2) + pow(y - path[step-1][1], 2));
    }

    // Increment iteration counter
    step++;
  }

  return path;
}
