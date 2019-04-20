/*
  Sand Table Pattern Maker

  This is a rewrite/refactor of my original Java sketches
*/

// Set the units, i.e. "mm", "in"
var units = "mm";

// Plotter settings
var max_x = 472.0;
var max_y = 380.0;

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
  pattern_select.option('Spiral');
  pattern_select.option('Spokes');
  pattern_select.changed(patternSelectEvent);
  pattern_select.selected('Spiral');

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

  // Draw the table
  drawTable();

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
    case "Spiral":
      path = drawSpiral();
      break;
    case "Spokes":
      path = drawSpokes();
      break;
    default:
      path = [[0,0]];
  }

  // Draw the path
  drawPath(path);

  // Calculate path length
  distance = 0;
  for (i = 1; i < path.length; i++) {
    distance += sqrt(pow(path[i][0] - path[i-1][0], 2) + pow(path[i][1] - path[i-1][1], 2));
  }

  // Display the path distance and time
  select("#pattern-distance").html(nfc(distance, 1) + " " + units);
  select("#pattern-time").html(nfc(distance / motor_speed, 1) + " minutes");
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
    case "Spiral":
      setupSpiral();
      break;
    case "Spokes":
      setupSpokes();
      break;
  }
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
