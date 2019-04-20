/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupFibonacci()
{

  // Max Theta control
  theta_div = createDiv('<label>Turns</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  theta_max = createSlider(1, 300, 100, 1)
    .parent(theta_div);
  theta_value_span = createSpan('1');
  theta_value_span.parent(theta_div);

  // Shrink Rate controls
  shrink_div = createDiv('<label>Shrink</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  shrink = createSlider(0.001, 0.010, 0.001, 0.0001)
    .parent(shrink_div);
  shrink_value_span = createSpan('1');
  shrink_value_span.parent(shrink_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawFibonacci()
{

  // Draw control selection values
  theta_value_span.html(theta_max.value());
  shrink_value_span.html(shrink.value());

  // Calculate the path
  path = drawFibonnaci(theta_max.value() * TWO_PI, shrink.value(), false);

  return path;
}

/*
* Draw Fibonacci Spiral Spokes
*
* Type: Radial
**/
function drawFibonnaci(max_theta, radius_shrink_factor, return_to_center)
{
  var path = new Array();
  var i = 0;
  var r = min(max_x/2, max_y/2);
  var theta = 0.0;
  var x, y, loop;
  while (r > 0 && theta < max_theta) {

    loop = i;

    // Go back to center on even loops
    if (return_to_center) {

      // Cut the loop count in half since half of the time
      // the coordinates are return to the center
      loop = i/2;

      if (i % 2 == 0) {
        x = 0.0;
        y = 0.0;
        continue;  // ?
      }
    }

    // Increment theta by golden ratio each iteration
    // https://en.wikipedia.org/wiki/Golden_angle
    theta = loop * PI * (3.0 - sqrt(5));

    // Set the radius
    // Decrease the radius a bit each cycle
    r = (1 - radius_shrink_factor * i) * (0.5 * min(max_x, max_y));

    // Convert to cartesian
    x = r * cos(theta);
    y = r * sin(theta);

    path[i] = [x,y];

    i++;
  }

  return path;
}
