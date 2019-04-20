/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupSpokes()
{

  // Spoke controls
  spokes_div = createDiv('<label>Spokes</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spokes = createSlider(1, 120, 12, 1);
  spokes.parent(spokes_div);
  spokes_value = createSpan('0');
  spokes_value.parent(spokes_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawSpokes()
{

  // Draw control selection values
  spokes_value.html(spokes.value());

  // Calculate the path
  path = calcSpokes(spokes.value());

  return path;
}

/**
 * Spokes that radiate out from the center
 **/
function calcSpokes(num_spokes) {

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

  // Loop through 360 degrees
  while (theta < TWO_PI) {

    // Even steps: Go to center
    // Odd steps: Go to radius
    if (step % 2 == 0) {
        x = 0.0;
        y = 0.0;
    } else {
        theta = ((step - 1)/2) * theta_per_step;
        x = max_r * cos(theta);
        y = max_r * sin(theta);
    }

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
