/*
  Sand Table Pattern Maker

  This is a rewrite/refactor of my original Java sketches
*/

// Set the units, i.e. "mm", "in"
var units = "mm";

// Plotter settings
var min_x = 0.0;
var max_x = 472.0;
var min_y = 0.0;
var max_y = 380.0;
var plotter_exceeded = false;

// Set motor speed in units/min
var motor_speed = 6000.0;

// Width/Diameter of print head (steel ball) used for etching pattern (mm)
var ball_size = 19.0;

// Store the total path distance
var distance;

// Processing standard function called once at beginning of Sketch
function setup() {

  // Debugging
  // noLoop();

  // Define canvas size
  var canvas = createCanvas(648, 648).parent('canvas-holder');

  // Pattern selector
  pattern_select_div = createDiv('<label>Pattern</label>')
    .parent('pattern-selector');
  pattern_select = createSelect()
    .parent(pattern_select_div);
  pattern_select.option('Circle');
  pattern_select.option('Diameters');
  pattern_select.option('Fibonacci');
  pattern_select.option('Cycloid');
  pattern_select.option('Spiral');
  pattern_select.option('Spokes');
  pattern_select.option('Zig Zag');
  pattern_select.selected('Cycloid');
  pattern_select.changed(patternSelectEvent);

  // Select pattern from URL query string
  let url_params = getURLParams();
  if (url_params.pattern) {
    pattern_select.selected(url_params.pattern);
  }

  select("#plotter-max_x").html(max_x + " " + units);
  select("#plotter-max_y").html(max_y + " " + units);
  select("#plotter-motor_speed").html(motor_speed + " " + units + "/min");
  select("#plotter-ball_size").html(ball_size + " " + units);

  // Download controls
  downloadButton = createButton('Download')
    .parent('download');
  downloadButton.mousePressed(download);

  // Initialize
  patternSelectEvent();
}

// Processing standard function that loops forever
function draw() {

  // Draw the background
  background(68);

  // Calculate the pattern
  switch(pattern_select.value()) {
    case "Circle":
      path = drawCircle();
      break;
    case "Diameters":
      path = drawDiameters();
      break;
    case "Fibonacci":
      path = drawFibonacci();
      break;
    case "Cycloid":
      path = drawCycloid();
      break;
    case "Spiral":
      path = drawSpiral();
      break;
    case "Spokes":
      path = drawSpokes();
      break;
    case "Zig Zag":
      path = drawZigZag();
      break;
    default:
      path = [[0,0]];
  }

  // Draw the table
  drawTable(path_exceeds_plotter(path));

  // Draw the path
  drawPath(path, 1);

  // Calculate path length
  distance = 0;
  for (i = 1; i < path.length; i++) {
    distance += sqrt(pow(path[i][0] - path[i-1][0], 2) + pow(path[i][1] - path[i-1][1], 2));
  }

  // Display the path distance and time
  select("#pattern-instructions").html(nfc(path.length));
  select("#pattern-distance").html(nfc(distance, 1) + " " + units);
  select("#pattern-time").html(nfc(distance / motor_speed, 1) + " minutes");
}

/**
 * Check to see if the path exceeds the plotter dimensions
 */
function path_exceeds_plotter(path)
{

  // Define function to extract column from multidimensional array
  const arrayColumn = (arr, n) => arr.map(a => a[n]);

  // Get X and Y coordinates as an 1-dimensional array
  x_coordinates = arrayColumn(path, 0);
  y_coordinates = arrayColumn(path, 1);

  // Check boundaries
  if (Math.min(...x_coordinates) < -((max_x - min_x)/2)) {
    return true;
  }
  if (Math.max(...x_coordinates) > max_x/2) {
    return true;
  }
  if (Math.min(...y_coordinates) < -((max_y - min_y)/2)) {
    return true;
  }
  if (Math.max(...y_coordinates) > max_y/2) {
    return true;
  }

  return false;
}

/**
 * Trigger actions when the pattern is changed
 */
function patternSelectEvent() {

  // Clear controls
  select('#pattern-controls').html('');

  switch(pattern_select.value()) {
    case "Circle":
      setupCircle();
      break;
    case "Diameters":
      setupDiameters();
      break;
    case "Fibonacci":
      setupFibonacci();
      break;
    case "Cycloid":
      setupCycloid();
      break;
    case "Spiral":
      setupSpiral();
      break;
    case "Spokes":
      setupSpokes();
      break;
    case "Zig Zag":
      setupZigZag();
      break;
  }

  // Update the URL
  history.replaceState({
        id: 'homepage'
    },
    'Patten | ' + pattern_select.value(),
    '?pattern=' + pattern_select.value()
  );

}

/**
 * Download items to the browser
 */
function download()
{

  // Download pattern image
  saveCanvas("pattern", "png")

  // Download pattern G-code
  save(createGcode(path), "pattern", "gcode");
}
