/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupWigglySpiral()
{

  // Offset control
  offset = createDiv('<label>Offset</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  spiral_offset = createSlider(2, 40, 20);
  spiral_offset.parent(offset);
  offset_value = createSpan('0');
  offset_value.parent(offset);

  // Wiggle Amplitude
  wiggle_amplitude_div = createDiv('<label>Amplitude</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  wiggle_amplitude = createSlider(1, 10, 5, 0.1);
  wiggle_amplitude.parent(wiggle_amplitude_div);
  wiggle_amplitude_value = createSpan('0');
  wiggle_amplitude_value.parent(wiggle_amplitude_div);

  // Wiggle Wavelength
  wiggle_wavelength_div = createDiv('<label>Wiggles/Rev</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  wiggle_wavelength = createSlider(0, 40, 20, 0.1);
  wiggle_wavelength.parent(wiggle_wavelength_div);
  wiggle_wavelength_value = createSpan('0');
  wiggle_wavelength_value.parent(wiggle_wavelength_div);
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawWigglySpiral()
{

  // Draw control selection values
  offset_value.html(spiral_offset.value() + " " + units);
  wiggle_amplitude_value.html(wiggle_amplitude.value() + " " + units);
  wiggle_wavelength_value.html(wiggle_wavelength.value());

  // Calculate a Spiral path
  return calcWigglySpiral(
    0,
    0,
    0.9 * (max_y/2),
    0,
    spiral_offset.value(),
    wiggle_amplitude.value(),
    wiggle_wavelength.value()
  );

}

/**
 * Calculate coordinates for a Wiggly Spiral
 **/
function calcWigglySpiral(start_x, start_y, start_r, start_theta, distance_between_turns, wiggle_amplitude, wiggle_frequency) {

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

  // Increase the denominator to get finer resolution (more instructions/longer time to plot)
  var theta_per_step = 1/300;

  // Continue as long as the design stays within bounds of the plotter
  // This isn't quite right yet. I need to look into the coordinate translations
  // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
  while (r > 0) {
  // while (theta < 100 * TWO_PI) {

    // Rotational Angle (steps per rotation in the denominator)
    theta = step * theta_per_step * TWO_PI;

    // Decrement the radius by a set amount per rotation
    // Every full rotation the radius is reduced by the offset (distance_between_turns)
    r = start_r - distance_between_turns * (step * theta_per_step);

    // Optional: Decay Frequency and Amplitude
    // wiggle_frequency = 0.9999 * wiggle_frequency;
    // wiggle_amplitude = 0.99999 * wiggle_amplitude;

    // Add a wiggle with a constant amplitude
    // Subtract from radius so that drawing area will not be exceeded
    r = r - wiggle_amplitude * sin(wiggle_frequency * theta);

    // Convert polar position to rectangular coordinates
    x = start_x + (r * cos(theta));
    y = start_y + (r * sin(theta));

    // Add coordinates to shape array
    path[step] = [x,y];

    // Increment iteration counter
    step++;
  }

  return path;
}
