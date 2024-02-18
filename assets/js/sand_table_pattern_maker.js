/*
  Sand Table Pattern Maker

  This is a rewrite/refactor of my original Java sketches
*/

// Set application version. Used to validate Local Storage
var app_version = "0.1.0";

// Set the units, i.e. "mm", "in"
var units = env.table.units;

// Plotter settings
var min_x = env.table.x.min;
var max_x = env.table.x.max;
var min_y = env.table.y.min;
var max_y = env.table.y.max;
var plotter_exceeded = false;

// Set motor speed in units/min
var motor_speed = env.motor.speed;

// Width/Diameter of print head (steel ball) used for etching pattern (in "units")
var ball_size = env.ball.diameter;

// Show/Hiden pattern overlay in Canvas
var pattern_config_overlay = false;
var coordinate_overlay = true;

// Store the total path distance
var distance;

// A counter for the draw loop
var draw_iteration = 0;

// Set G-Code command, usually "GO" or "G1"
var gCodeCommand = env.gcode.command;

var plotter_format_select;

// Set a global variable for Pattern <select> HTML object
var pattern_select;

// Set a global variable for the "previous" Pattern. When a new Pattern
// is selected this is used to save the configuration of the previous Pattern
var previous_pattern;

var path;

// Flag for setting whether the pattern coordinates should be recalculated
var recalculate_pattern = env.recalculate_pattern;

// Master Patterns object to hold patterns
var Patterns = {
  "coordinates": new Coordinates(),
  "circle": new Circle(),
  "cross": new Cross(),
  "cycloid": new Cycloid(),
  "diameters": new Diameters(),
  "draw": new Draw(),
  "egg": new Egg(),
  "farris": new Farris(),
  "fermatspiral": new FermatSpiral(),
  "fibonacci": new Fibonacci(),
  "fibonaccilollipops": new FibonacciLollipops(),
  "frame": new Frame(),
  "gcode": new Gcode(),
  "gravity": new Gravity(),
  "heart": new Heart(),
  "lindenmayer": new Lindenmayer(),
  "lissajous": new Lissajous(),
  "parametric": new Parametric(),
  "rectangle": new Rectangle(),
  "rhodonea": new Rhodonea(),
  "shapemorph": new ShapeMorph(),
  "shapespin": new ShapeSpin(),
  "spiral": new Spiral(),
  "logspiral": new LogarithmicSpiral(),
  "spokes": new Spokes(),
  "star": new Star(),
  "superellipse": new Superellipse(),
  "text": new Text(),
  "thr": new ThetaRhoInput(),
  "wigglyspiral": new WigglySpiral(),
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
  var pattern_select_div = createDiv('<label>Pattern</label>')
    .parent('pattern-selector');
  pattern_select = createSelect()
    .parent(pattern_select_div)
    .attribute("name", "pattern");

  // Add patterns from object
  var pattern_select_menu = document.querySelector('#pattern-selector > div > select');
  const entries = Object.entries(Patterns)
  for (const [pattern_key, pattern_object] of entries) {
    pattern_select.option(pattern_object.name, pattern_object.key);
  }

  // Set default selected pattern
  pattern_select.selected('spiral');

  // Add change event handler
  pattern_select.changed(patternSelectEvent);

  // Select pattern from Local Storage
  var local_storage_pattern = localStorage.getItem('lastPattern');
  if (local_storage_pattern) {
    pattern_select.selected(local_storage_pattern);
  }

  // Select pattern from URL query string.
  // This will intentionally overwrite any saved configuration
  let url_params = getURLParams();
  if (url_params.pattern) {
    pattern_select.selected(url_params.pattern);
  }

  // Initialize previous pattern
  previous_pattern = pattern_select.value();

  // Load configuration state of selected Pattern (if available)
  var loaded_patterns;
  loadPatternConfig(pattern_select.value());

  // Add select for Table format (Cartesian or Polar)
  plotter_format_select = createSelect()
    .attribute('name', key)
    .parent('#plotter-format')
  plotter_format_select.option("Cartesian", "cartesian");
  plotter_format_select.option("Polar", "polar");
  plotter_format_select.selected(env.table.format);
  plotter_format_select.changed(display_config_values);

  // Display plotter configuration values
  display_config_values();

  // Download controls
  downloadButton = createButton('Download')
    .parent('download');
  downloadButton.mousePressed(download);

  // Initialize.
  patternSelectEvent(false);
}

// Processing standard function that loops forever
function draw() {

  // Draw the background
  background(68);

  // Save the selected pattern to a local variable
  var selected_pattern = pattern_select.value();

  // Some patterns, like a free-drawing, must be recalculated on every draw loop
  if (selected_pattern == "draw") {
    recalculate_pattern = true;
  }

  // Recalculate the pattern if required (depending on env.recalculate_pattern)
  if (recalculate_pattern) {
    path = Patterns[selected_pattern].draw();
    recalculate_pattern = env.recalculate_pattern;
  }

  // Reverse the path
  if (document.querySelector('#pattern-controls input[name=reverse]')) {

    // Save to Pattern object
    Patterns[selected_pattern].config.reverse.value = document.querySelector('#pattern-controls input[name=reverse]').checked;

    // Reverse the path if checked (true)
    if (Patterns[selected_pattern].config.reverse.value) {
      path.reverse();
    }
  }

  // Optimize path
  // Remove step sizes less than a threshold ("units")
  if (typeof Patterns[selected_pattern].path_sampling_optimization !== 'undefined') {
    path = optimizePath(
      path,
      Patterns[selected_pattern].path_sampling_optimization
    );
  }

  // Draw the table
  drawTable(path_exceeds_plotter(path));

  // Draw the path [path, path width, connected path, animated]
  drawPath(path, 2, false, true, coordinate_overlay);

  // Calculate path length
  distance = 0;
  for (i = 1; i < path.length; i++) {
    distance += sqrt(pow(path[i][0] - path[i-1][0], 2) + pow(path[i][1] - path[i-1][1], 2));
  }

  // Display the path distance and time
  select("#pattern-instructions").html(nfc(path.length));
  select("#pattern-distance").html(nfc(distance, 1) + " " + units);
  select("#pattern-time").html(nfc(distance / motor_speed, 1) + " minutes");

  // Draw pattern configuration
  if (pattern_config_overlay) {
    draw_pattern_config(Patterns[selected_pattern]);
  }

  // Increment draw loop counter
  draw_iteration++;
}

/**
 * Draw selected specs for the pattern configuration
 */
function draw_pattern_config(pattern)
{
  var base_unit = 12;

  noStroke();
  fill(255);
  textAlign(LEFT);

  // Render text
  push();
  translate(0.25 * base_unit, 0.25 * base_unit);
  text("Pattern: " + pattern.name, 0, base_unit)
  var j = 2.25 * base_unit;
  Object.keys(pattern.config).forEach(key => {
    // TODO: Extract value for all input types (checkbox, select, etc.)
    text(key + ": " + pattern.config[key].value, 0, j);
    j = j + (1.25 * base_unit);
  });
  pop();

  // Add footer with information about the site
  noStroke();
  fill(128,128,128);
  textAlign(CENTER);
  text('Created at https://markroland.github.io/sand-table-pattern-maker', width/2, height - 72);
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
function patternSelectEvent(recalculate_pattern = true) {

  // Clear controls
  select('#pattern-controls').html('');

  // Save the selected pattern to a local variable
  var selected_pattern = pattern_select.value();
  localStorage.setItem('lastPattern', selected_pattern);

  // Load Pattern State
  loadPatternConfig(selected_pattern);

  // Save the state of the Patterns object to Local Browser Storage
  if (recalculate_pattern) {
    savePatternConfig(previous_pattern);
  }

  // Update the previous pattern
  previous_pattern = selected_pattern;

  // Create HTML elements for each pattern configuration option
  let controls = new Array();
  const configs = Object.entries(Patterns[selected_pattern].config);
  for (const [key, val] of configs) {

    // Create a new object
    var control = new Object();

    // Create the div that contains the control
    control.div = createDiv('<label>' + val.name + '</label>')
      .parent('pattern-controls')
      .addClass('pattern-control');

    // Create the control form input
    if (val.input.type == "createSelect") {
      control.input = createSelect()
        .attribute('name', key)
        .parent(control.div)
        .addClass(val.input.class);
      const entries = Object.entries(val.input.options)
      for (const [key, object] of entries) {
        control.input.option(object, key);
      }
      if (val.value) {
        control.input.selected(val.value);
      }
    } else if (val.input.type == "createSlider") {
      control.input = createSlider(
        val.input.params[0],
        val.input.params[1],
        val.value ? val.value : val.input.params[2],
        val.input.params[3]
      )
      .attribute('name', key)
      .parent(control.div)
      .addClass(val.input.class);
    } else if (val.input.type == "createCheckbox") {
      // control.input = createInput(val.input.params[0], "checkbox") // Should it be this?
      control.input = createInput(
        val.input.params[0],
        val.input.params[1],
        val.input.params[2]
      )
      .attribute("type", "checkbox")
      .attribute('name', key)
      .attribute('checkbox', null)
      .parent(control.div);
      if (val.input.params[2] == 1) {
        control.input.attribute('checked', 'checked');
      } else if (val.value) {
        control.input.attribute('checked', 'checked');
      }
    } else if (val.input.type == "createInput") {
      control.input = createInput(
        val.value ? val.value : val.input.params[0],
        val.input.params[1]
      )
      .attribute('name', key)
      .parent(control.div);
    } else if (val.input.type == "createTextarea") {
      control.input = createElement(
        "textarea",
        val.value ? val.value : val.input.value,
      )
      .attribute("rows", val.input.attributes.rows)
      .attribute("cols", val.input.attributes.cols)
      .attribute('name', key)
      .parent(control.div);
    }

    // Add change event handler
    // TODO: This doesn't work well for Textareas
    // TODO: This breaks the "Free Draw" pattern
    control.input.changed(function(){
      recalculate_pattern = true;
    });

    // Create a span element to display the current input's value (useful for Sliders)
    if (val.input.displayValue) {
      let radius_value = createSpan('0')
        .parent(control.div);
    }

    // Add to "controls" object
    controls.push(control);
  }

  // Change document title
  document.title = 'Sand Pattern | ' + Patterns[selected_pattern].name;

  // Update the URL
  if (Patterns[pattern_select.value()] !== undefined) {
    updateURL(pattern_select.value())
  }
}

/**
 * Trigger actions when the pattern is changed
 */
function display_config_values() {

  env.table.format = plotter_format_select.value();

  // Display config values
  if (env.table.format == "cartesian") {
    select("#plotter-max_x").html(min_x + " - " + max_x + " " + units);
    select("#plotter-max_y").html(min_y + " - " + max_y + " " + units);
  } else {
    select("#plotter-max_x").html("NA");
    select("#plotter-max_y").html("NA");
  }
  select("#plotter-motor_speed").html(motor_speed + " " + units + "/min");
  select("#plotter-ball_size").html(ball_size + " " + units);
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
  var selected_pattern = pattern_select.value();
  if (Patterns[selected_pattern] !== undefined) {
    filename += "-" + Patterns[selected_pattern].key;
  }

  draw_pattern_config(Patterns[selected_pattern]);

  // Download pattern image
  // TEMP: Disabled to avoid "Multiple Download" prompt
  // saveCanvas(filename, "png")

  // Download pattern G-code
  if (env.table.format == "cartesian") {
    save(createGcode(path, gCodeCommand), filename, "gcode");
  }

  // Download pattern Theta-Rho Track
  else if (env.table.format == "polar") {
    let thr_path = new thetaRho(path);
    save(thr_path.convert(path), filename, "thr");
  }
}

/**
 * Process key presses
 */
function keyTyped() {
  if (key === 'c') {
    coordinate_overlay = !coordinate_overlay;
  } else if (key === 'd') {

    var selected_pattern = pattern_select.value();
    let path = Patterns[selected_pattern].draw();

    imagePath(path);

  } else if (key === 'o') {
    pattern_config_overlay = !pattern_config_overlay;
  }
}

/**
 * Convert a Path to an image
 **/
function imagePath(path) {

  const canvas_dimension = 1024;

  // Draw something to an offscreen canvas
  let offscreen = new OffscreenCanvas(canvas_dimension, canvas_dimension);
  let offscreen_ctx = offscreen.getContext('2d', { alpha: false });
  offscreen_ctx.fillStyle = 'rgb(0, 0, 0)';
  offscreen_ctx.fillRect(0, 0, offscreen.width, offscreen.height);

  offscreen_ctx.lineCap = "butt";

  // Path offset for center on canvas
  const dx = offscreen.width/2;
  const dy = offscreen.height/2;

  const radius_normal_px = (0.5 * Math.min((env.table.x.max - env.table.x.min), (env.table.y.max - env.table.y.min)));

  const ball_diameter = 0.044 * radius_normal_px;

  const scale = canvas_dimension / (2 * radius_normal_px);

  // Draw Sand
  //*
  offscreen_ctx.beginPath();
  offscreen_ctx.fillStyle = 'rgb(128, 128, 128)';
  offscreen_ctx.arc(dx, dy, radius_normal_px * scale, 0, 2 * Math.PI);
  offscreen_ctx.fill();
  //*/

  // Draw
  offscreen_ctx.strokeStyle = 'rgb(200, 200, 200)';
  offscreen_ctx.lineWidth = 2;

  // Scale
  for (let i = 0; i < path.length; i++) {
    path[i] = [
      path[i][0] * scale,
      -path[i][1] * scale
    ];
  }

  // Single line
  /*
  offscreen_ctx.beginPath();
  offscreen_ctx.moveTo(dx+ path[0][0], dy + path[0][1]);
  for (let i = 1; i < path.length; i++) {
    offscreen_ctx.lineTo(dx+ path[i][0], dy + path[i][1]);
  }
  offscreen_ctx.stroke();
  //*/

  // Segments

  if (offscreen_ctx.lineCap == "butt") {

    // Method 1
    // This method draws lots of short segments and
    // preserves overlaps, but the line "miters" aren't
    // perfectly crisp
    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(128, 128, 128)';
      offscreen_ctx.lineWidth = 13;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(192, 192, 192)';
      offscreen_ctx.lineWidth = 11;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(255, 255, 255)';
      offscreen_ctx.lineWidth = 9;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(192, 192, 192)';
      offscreen_ctx.lineWidth = 7;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(128, 128, 128)';
      offscreen_ctx.lineWidth = 5;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(64, 64, 64)';
      offscreen_ctx.lineWidth = 3;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();

      offscreen_ctx.strokeStyle = 'rgb(0, 0, 0)';
      offscreen_ctx.lineWidth = 1;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }

  } else if (offscreen_ctx.lineCap == "round") {

    // Method 2
    // This addresses the "miter" discontinuities but
    // overlaps are not preserved

    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(192, 192, 192)';
      offscreen_ctx.lineWidth = 9;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }

    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(255, 255, 255)';
      offscreen_ctx.lineWidth = 7;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }

    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(192, 192, 192)';
      offscreen_ctx.lineWidth = 5;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }

    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(128, 128, 128)';
      offscreen_ctx.lineWidth = 3;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }

    for (let i = 0; i < path.length - 1; i++) {
      offscreen_ctx.strokeStyle = 'rgb(0, 0, 0)';
      offscreen_ctx.lineWidth = 1;
      offscreen_ctx.beginPath();
      offscreen_ctx.moveTo(dx + path[i][0], dy + path[i][1]);
      offscreen_ctx.lineTo(dx + path[i+1][0], dy + path[i+1][1]);
      offscreen_ctx.stroke();
    }
  }

  // TODO: Method 3
  // Calculate an offset line and draw a thin offset segment (as
  // opposed to layered thick-to-thin segments)

  // Draw ball
  //*
  offscreen_ctx.beginPath();
  offscreen_ctx.fillStyle = 'rgb(255, 0, 0)';
  offscreen_ctx.arc(dx + path[path.length-1][0], dy + path[path.length-1][1], ball_diameter/2, 0, 2 * Math.PI);
  offscreen_ctx.fill();
  //*/

  // Convert the canvas to a blob
  offscreen.convertToBlob().then(function(blob) {

    // Set filename
    let filename = "pattern";
    var selected_pattern = pattern_select.value();
    if (Patterns[selected_pattern] !== undefined) {
      filename += "-" + Patterns[selected_pattern].key;
    }

    // 1a) Create an object URL from the blob
    const pngUrl = URL.createObjectURL(blob);

    // 1b) Create a new image element and set the source to be the object URL
    var img = new Image();
    img.src = pngUrl;

    // 2) Download: Create a new link and trigger a click to download it and then remove the element
    const a = document.createElement("a");
    a.href = pngUrl;
    // element.setAttribute('href', 'data:image/png' + encodeURIComponent(svg_text));
    a.download = filename + ".png";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

/**
 * Save state to the URL
 * https://zellwk.com/blog/looping-through-js-objects/
 */
function updateURL(selected_pattern)
{
  let query_string = '?pattern=' + selected_pattern;
  const entries = Object.entries(Patterns[selected_pattern].config)

  // Loop through configuration and create query string
  // Uncommenting for now because these are not being read in
  /*
  for (const [param, content] of entries) {
    query_string = query_string.concat(`&${param}=${content.value}`)
  }
  //*/

  // Update the browser history
  history.replaceState(
    {id: 'homepage'},
    document.title,
    query_string
  );
}

/**
 * Save a Pattern configuration object
 */
function savePatternConfig(previous_pattern)
{
  localStorage.setItem('appVersion', app_version);
  localStorage.setItem('lastSaved', new Date());
  localStorage.setItem("v" + app_version + "_" + previous_pattern, JSON.stringify(Patterns[previous_pattern].config));
}

/**
 * Load a Pattern configuration object
 */
function loadPatternConfig(selected_pattern)
{
  var loaded_state = JSON.parse(localStorage.getItem("v" + app_version + "_" + selected_pattern));
  if (loaded_state) {
    Patterns[selected_pattern].config = loaded_state;
  }
}