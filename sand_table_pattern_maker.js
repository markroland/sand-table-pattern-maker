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

// Width/Diameter of print head (steel ball) used for etching pattern (in "units")
var ball_size = 19.0;

// Store the total path distance
var distance;

// A counter for the draw loop
var draw_iteration = 0;

// Master Patterns object to hold patterns
var Patterns = {
  "circle": new Circle(),
  "fermatspiral": new FermatSpiral(),
  "heart": new Heart(),
  "lindenmayer": new Lindenmayer(),
  "parametric": new Parametric(),
  "rectangle": new Rectangle(),
  "shapemorph": new ShapeMorph(),
  "shapespin": new ShapeSpin(),
  "spiral": new Spiral(),
  "star": new Star(),
  "zigzag": new ZigZag()
}

// Processing standard function called once at beginning of Sketch
function setup() {

  // Debugging
  // noLoop();

  // Slow down the frame rate to reduce calculations
  frameRate(10);

  // Define canvas size
  var canvas = createCanvas(648, 648).parent('canvas-holder');

  // Pattern selector
  pattern_select_div = createDiv('<label>Pattern</label>')
    .parent('pattern-selector');
  pattern_select = createSelect()
    .parent(pattern_select_div);

  // Add patterns from object
  var pattern_select_menu = document.querySelector('#pattern-selector > div > select');
  const entries = Object.entries(Patterns)
  for (const [pattern_key, pattern_object] of entries) {
    pattern_select.option(pattern_object.name, pattern_object.key);
  }
  pattern_select.option('Diameters');
  pattern_select.option('Fibonacci');
  pattern_select.option('Cycloid');
  pattern_select.option('Spiral - Modulated');
  pattern_select.option('Spokes');
  pattern_select.selected('Cycloid');
  pattern_select.changed(patternSelectEvent);

  // Select pattern from URL query string
  let url_params = getURLParams();
  if (url_params.pattern) {
    pattern_select.selected(url_params.pattern);
  }

  // Display config values
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
    case "Diameters":
      path = drawDiameters();
      break;
    case "Fibonacci":
      path = drawFibonacci();
      break;
    case "Cycloid":
      path = drawCycloid();
      break;
    case "Spiral - Modulated":
      path = drawWigglySpiral();
      break;
    case "Spokes":
      path = drawSpokes();
      break;
    default:
      path = Patterns[pattern_select.value()].draw();
  }

  // Optimize path
  // Remove step sizes less than a threshold ("units")
  // path = optimizePath(path, 5);

  // Draw the table
  drawTable(path_exceeds_plotter(path));

  // Draw the path [path, path width, connected path, animated]
  drawPath(path, 2, true, true);

  // Calculate path length
  distance = 0;
  for (i = 1; i < path.length; i++) {
    distance += sqrt(pow(path[i][0] - path[i-1][0], 2) + pow(path[i][1] - path[i-1][1], 2));
  }

  // Display the path distance and time
  select("#pattern-instructions").html(nfc(path.length));
  select("#pattern-distance").html(nfc(distance, 1) + " " + units);
  select("#pattern-time").html(nfc(distance / motor_speed, 1) + " minutes");

  // Update the URL (and browser history)
  // https://zellwk.com/blog/looping-through-js-objects/
  if (Patterns[pattern_select.value()] !== undefined) {
    let query_string = '?pattern=' + pattern_select.value();
    const entries = Object.entries(Patterns[pattern_select.value()].config)
    for (const [param, content] of entries) {
      query_string = query_string.concat(`&${param}=${content.value}`)
    }
    history.replaceState({
          id: 'homepage'
      },
      document.title,
      query_string
    );
  }

  // Increment draw loop counter
  draw_iteration++;
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
    case "Diameters":
      setupDiameters();
      break;
    case "Fibonacci":
      setupFibonacci();
      break;
    case "Cycloid":
      setupCycloid();
      break;
    case "Spiral - Modulated":
      setupWigglySpiral();
      break;
    case "Spokes":
      setupSpokes();
      break;
    default:
      Patterns[pattern_select.value()].setup();
  }

  // Change document title
  document.title = 'Sand Pattern | ' + pattern_select.value();

  // Update the URL
  // https://zellwk.com/blog/looping-through-js-objects/
  //*
  if (Patterns[pattern_select.value()] !== undefined) {
    let query_string = '?pattern=' + pattern_select.value();
    const entries = Object.entries(Patterns[pattern_select.value()].config)

    for (const [param, content] of entries) {
      query_string = query_string.concat(`&${param}=${content.value}`)
    }

    // Update the browser history
    history.replaceState({
          id: 'homepage'
      },
      document.title,
      query_string
    );
  }
  //*/
}

/**
 * Optimize the path to remove insignificant steps
 */
function optimizePath(path, min_distance)
{
  var filtered_path = new Array();
  /*
  let filtered_path = path.filter(function(element, index){
    // Return every-other step
    if (index % 2) {
      return false;
    }
    return true;
  });
  */

  // Copy first position of "path" to the filtered path
  filtered_path.push(path[0]);

  // Subsequent positions must greater than the minimum distance to be added
  path.forEach(function(element, index) {
    var fp_last = filtered_path[filtered_path.length - 1];
    var step_distance = sqrt(pow(element[0] - fp_last[0], 2) + pow(element[1] - fp_last[1], 2));
    if (step_distance > min_distance) {
      filtered_path.push(element);
    }
  });

  return filtered_path;
}

/**
 * Download items to the browser
 */
function download()
{

  // Set filename
  let filename = "pattern";
  if (Patterns[pattern_select.value()] !== undefined) {
    filename += "-" + Patterns[pattern_select.value()].key;
  }

  // Download pattern image
  saveCanvas(filename, "png")

  // Download pattern G-code
  save(createGcode(path, "G0"), filename, "gcode");
}
