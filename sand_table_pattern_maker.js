/*
  Sand Table Pattern Maker

  This is a rewrite/refactor of my original Java sketches
*/

// Plotter settings (mm)
var max_x = 472.0;
var max_y = 380.0;

// Set motor speed in mm/min
var motor_speed = 6000.0;

// Width/Diameter of print head (steel ball) used for etching pattern (mm)
var ball_size = 19.0;

// Store the total path distance
var distance;

// Processing standard function called once at beginning of Sketch
function setup() {

  // Define canvas size
  var canvas = createCanvas(648, 648);

  // Move the canvas so it’s inside our <div id="sketch-holder">
  canvas.parent('sketch-holder');

  // Pattern selector
  pattern_select_div = createDiv('<label>Pattern</label>')
    .parent('sketch-holder');
  pattern_select = createSelect()
    .parent(pattern_select_div);
  pattern_select.option('Spiral')
  pattern_select.option('B')
  pattern_select.changed(patternSelectEvent);

  // Download controls
  downloadButton = createButton('Download');
  downloadButton.parent('sketch-holder');
  downloadButton.mousePressed(download);

  // Initialize
  if (pattern_select.value() == "Spiral") {
    setupSpiral();
  }
}

// Processing standard function that loops forever
function draw() {

  // Draw the background
  background(255);

  // Draw the table
  drawTable();

  // Calculate the pattern
  if (pattern_select.value() == "Spiral") {
    path = drawSpiral();
  }

  // Draw the path
  drawPath(path);
}

/**
 * Trigger actions when the pattern is changed
 */
function patternSelectEvent() {
  var item = sel.value();
  console.log(item);
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
