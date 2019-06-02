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
  spokes_span = createSpan('0');
  spokes_span.parent(spokes_div);

  // Number of Waves controls
  waves_div = createDiv('<label>Waves</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  waves = createSlider(1, 30, 4, 1);
  waves.parent(waves_div);
  waves_span = createSpan('0');
  waves_span.parent(waves_div);

  // Wave Amplitude controls
  wave_amplitude_div = createDiv('<label>Amplitude</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  wave_amplitude = createSlider(0, 60, 20, 1);
  wave_amplitude.parent(wave_amplitude_div);
  wave_amplitude_span = createSpan('0');
  wave_amplitude_span.parent(wave_amplitude_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawDiameters()
{

  // Draw control selection values
  spokes_span.html(spokes.value());
  waves_span.html(waves.value());
  wave_amplitude_span.html(wave_amplitude.value());

  // Calculate the path
  path = calcDiameters(spokes.value(), waves.value(), wave_amplitude.value());

  return path;
}

/**
 * Diameters that cross the circle
 **/
function calcDiameters(num_spokes, num_waves, wave_amplitude) {

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

  // Sub-steps
  var sub_steps = 20 * num_waves;

  // Set direction of travel for "x"
  var direction = 1;

  // Loop through 360 degrees
  while (theta < TWO_PI) {

    // Calculate new theta
    theta = step * theta_per_step;

    for (var j = 0; j <= sub_steps; j++) {

      // Sine Wave
      x = direction * (min(max_x, max_y)/2) * ((j - (sub_steps/2))/(sub_steps/2));
      y = wave_amplitude * sin((j/sub_steps) * num_waves * TWO_PI);

      // Rotate [x,y] coordinates around [0,0] by angle theta, and then append to path
      path.push(
        rotationMatrix(x, y, theta)
      );
    }

    // Increment iteration counter
    step++;

    // Alternate the direction each step, going from +x to -x
    direction = direction * -1;
  }

  return path;
}

/**
 * Rotate points x and y by angle theta about center point (0,0)
 * https://en.wikipedia.org/wiki/Rotation_matrix
 **/
function rotationMatrix(x, y, theta) {
    return [
      x * cos(theta) - y * sin(theta),
      x * sin(theta) + y * cos(theta)
    ];
}