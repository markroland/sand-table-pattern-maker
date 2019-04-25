/**
 * Use this in setup() to set up the Pattern's controls
 */
function setupZigZag()
{

  // Spacing control
  var spacing_divisions = (max_y - min_y) / 2;
  var spacing_interval = (max_y - min_y) / spacing_divisions;

  spacing_div = createDiv('<label>Spacing</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  // spacing = createSlider(spacing_interval, spacing_divisions * spacing_interval, 0.5 * spacing_divisions * spacing_interval, spacing_interval)
  // spacing = createSlider(3, min(max_x-min_x, max_y-min_y)/10, 3, 1)
  spacing = createSlider(-spacing_divisions, -1, -0.5 * spacing_divisions, 1)
    .parent(spacing_div);
  spacing_value = createSpan('0');
  spacing_value.parent(spacing_div);

  // Margin control
  margin_div = createDiv('<label>Margin</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  margin = createSlider(0, min(max_x-min_x, max_y-min_y)/10, 0, 1)
    .parent(margin_div);
  margin_value = createSpan('0');
  margin_value.parent(margin_div);

  // Border control
  border_div = createDiv('<label>Border</label>')
    .parent('pattern-controls')
    .addClass('pattern-control');
  border = createInput(0,1,0)
    .attribute("type","checkbox")
    .attribute('checked', null)
    .parent(border_div);
  border_hint = createSpan('Check to draw a border');
  border_hint.parent(border_div)
}

/**
 * Use this in draw() to compose the Pattern
 */
function drawZigZag()
{

  // Draw control selection values
  angle = 0.0;
  // spacing_value.html(nfc(((40 - spacing.value())/40) * ((max_y - min_y)/2),1));
  spacing_value.html(nfc((max_y - min_y)/(-spacing.value()), 1) + " " + units);
  margin_value.html(margin.value() + " " + units);

  path = calcZigZag(
    (max_y - min_y)/(-spacing.value()),
    // ((40 - spacing.value())/40) * ((max_y - min_y)/2),
    margin.value(),
    angle,
    border.elt.checked
  );

  return path;
}

/**
 * Calculate coordinates for a zig-zag pattern
 *
 **/
function calcZigZag(spacing, margin, angle, border) {

  // Set initial values
  var start_x = -((max_x/2) - margin);
  var start_y = -((max_y/2) - margin);
  var x = start_x;
  var y = start_y;

  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter.
  var step = 0;

  // Continue as long as the design stays within bounds of the plotter
  while ((y + spacing) <= ((max_y/2) - margin)) {

    if (step % 4 == 0) {
        // Move Right
        x = (max_x - min_x)/2 - margin;
    } else if (step % 4 == 2) {
        // Move Left
        x = -(max_x - min_x)/2 + margin;
    } else {
        // Move Up
        y = y + spacing;
    }

    // Add coordinates to shape array
    path[step] = [x,y];

    // Increment iteration counter
    step++;
  }

  if (border) {

    // Ends on left (min) side
    if (x < 0) {
        path.push([(max_x/2 - margin), y]);
        path.push([(max_x/2 - margin), start_y]);
        path.push([x, start_y]);
        path.push([x, y]);
    } else {
        path.push([+((max_x-min_x)/2 - margin), start_y]);
        path.push([-((max_x-min_x)/2 - margin), start_y]);
        path.push([-((max_x-min_x)/2 - margin), y]);
        path.push([x, y]);
    }

  }

  return path;
}
