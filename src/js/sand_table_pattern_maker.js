/*
  Sand Table Pattern Maker

  This is a rewrite/refactor of my original Java sketches
*/
import env from './env.js';

import PathHelper from '@markroland/path-helper'

import createGcode from './gCode.js';
import thetaRho from './thetaRho.js';

// Set application version. Used to validate Local Storage
const app_version = env.app.version;

// Set the units, i.e. "mm", "in"
const units = env.table.units;

// Plotter settings
const min_x = env.table.x.min;
const max_x = env.table.x.max;
const min_y = env.table.y.min;
const max_y = env.table.y.max;

// Set motor speed in units/min
const motor_speed = env.motor.speed;

// Width/Diameter of print head (steel ball) used for etching pattern (in "units")
const ball_size = env.ball.diameter;

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

var path = [];

let path_preview = [];

// Flag for setting whether the pattern coordinates should be recalculated
var recalculate_pattern = env.recalculate_pattern;

// Master Patterns object to hold patterns
import Patterns from './patterns/index.js';

const PathHelp = new PathHelper();

// p5 is loaded through index.html
new p5((sketch) => {

  // Processing standard function called once at beginning of Sketch
  sketch.setup = () => {

    // Debugging
    // sketch.noLoop();

    // Slow down the frame rate to reduce calculations
    if (env.app.framerate && !isNaN(env.app.framerate)) {
      sketch.frameRate(env.app.framerate);
    }

    // Define canvas size
    var canvas = sketch.createCanvas(env.canvas.width, env.canvas.height).parent('canvas-holder');

    // Pattern selector
    var pattern_select_div = sketch.createDiv('<label>Pattern</label>')
      .parent('pattern-selector');
    pattern_select = sketch.createSelect()
      .parent(pattern_select_div)
      .attribute("name", "pattern");

    // Add patterns from object
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
    let url_params = sketch.getURLParams();
    if (url_params.pattern) {
      pattern_select.selected(url_params.pattern);
    }

    // Initialize previous pattern
    previous_pattern = pattern_select.value();

    // Load configuration state of selected Pattern (if available)
    loadPatternConfig(pattern_select.value());

    // Add select for Table format (Cartesian or Polar)
    plotter_format_select = sketch.createSelect()
      .attribute('name', 'TBD')
      .parent('#plotter-format')
    plotter_format_select.option("Cartesian", "cartesian");
    plotter_format_select.option("Polar", "polar");
    plotter_format_select.selected(localStorage.getItem('format') ?? env.table.format);
    plotter_format_select.changed(function () {
      display_config_values();
      localStorage.setItem('format', plotter_format_select.value());
    });

    // Display plotter configuration values
    display_config_values();

    // Download controls
    const downloadButton = sketch.createButton('Download')
      .parent('download');
    downloadButton.mousePressed(download);

    // Initialize.
    patternSelectEvent(false);

    const selected_pattern = pattern_select.value();
    path = Patterns[selected_pattern].draw();
  }

  // Processing standard function that loops forever
  sketch.draw = () => {

    // Draw the background
    sketch.background(68);

    // Save the selected pattern to a local variable
    var selected_pattern = pattern_select.value();

    path_preview = path;

    // Some patterns, like a free-drawing, must be recalculated on every draw loop
    if (selected_pattern == "draw") {
      recalculate_pattern = true;
      if (env.mouse.pressed) {
        env.mouse.x = sketch.mouseX;
        env.mouse.y = sketch.mouseY;
      }
    }

    // Recalculate the pattern if required (depending on env.recalculate_pattern)
    if (recalculate_pattern) {
      path = Patterns[selected_pattern].draw();
      if (path.length > 0) {
        path_preview = PathHelp.dividePathComplete(path, 10);
      }
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
    if (path_preview.length > 0) {
      drawPath(path_preview, 2, false, true, coordinate_overlay);
    }

    // Calculate path length
    distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += Math.sqrt(sketch.pow(path[i][0] - path[i-1][0], 2) + sketch.pow(path[i][1] - path[i-1][1], 2));
    }

    // Display the path distance and time
    sketch.select("#pattern-instructions").html(sketch.nfc(path.length));
    sketch.select("#pattern-distance").html(sketch.nfc(distance, 1) + " " + units);
    sketch.select("#pattern-time").html(sketch.nfc(distance / motor_speed, 1) + " minutes");

    // Draw pattern configuration
    if (pattern_config_overlay) {
      draw_pattern_config(Patterns[selected_pattern]);
    }

    // Increment draw loop counter
    draw_iteration++;
  }

  // Add event callback for mouse pressed
  sketch.mousePressed = () => {
    env.mouse.pressed = true;
  }

  sketch.mouseReleased = () => {
    env.mouse.pressed = false;
  }

  /**
   * Trigger actions when the pattern is changed
   */
  function display_config_values() {

    env.table.format = plotter_format_select.value();

    // Display config values
    if (env.table.format == "cartesian") {
      sketch.select("#plotter-max_x").html(min_x + " - " + max_x + " " + units);
      sketch.select("#plotter-max_y").html(min_y + " - " + max_y + " " + units);
    } else {
      sketch.select("#plotter-max_x").html("NA");
      sketch.select("#plotter-max_y").html("NA");
    }
    sketch.select("#plotter-motor_speed").html(motor_speed + " " + units + "/min");
    sketch.select("#plotter-ball_size").html(ball_size + " " + units);
  }

  /**
   * Trigger actions when the pattern is changed
   */
  function patternSelectEvent(recalculate_pattern = true) {

    // Clear controls
    sketch.select('#pattern-controls').html('');

    // Save the selected pattern to a local variable
    const selected_pattern = pattern_select.value();
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
      control.div = sketch.createDiv('<label>' + val.name + '</label>')
        .parent('pattern-controls')
        .addClass('pattern-control');

      // Create the control form input
      if (val.input.type == "createSelect") {
        control.input = sketch.createSelect()
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
        control.input = sketch.createSlider(
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
        control.input = sketch.createInput(
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
        control.input = sketch.createInput(
          val.value ? val.value : val.input.params[0],
          val.input.params[1]
        )
        .attribute('name', key)
        .parent(control.div);
      } else if (val.input.type == "createTextarea") {
        control.input = sketch.createElement(
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
        sketch.createSpan('0').parent(control.div);
      }

      // Add to "controls" object
      controls.push(control);
    }

    // Change document title
    document.title = 'Sand Pattern | ' + Patterns[selected_pattern].name;

    // Update the URL
    if (Patterns[selected_pattern] !== undefined) {
      updateURL(selected_pattern)
    }

    // Recalculate the pattern
    path = Patterns[selected_pattern].draw();
  }

  function drawTable(plotter_exceeded = false) {

    let coordinate_labels = true;

    let table_radius = Math.min(env.table.x.max - env.table.x.min, env.table.y.max - env.table.y.min) / 2;

    // Draw table surface
    sketch.noStroke();
    sketch.rectMode(sketch.CENTER);
    sketch.fill(220, 220, 220);
    // sketch.ellipse(sketch.width/2, sketch.height/2, sketch.width, sketch.height);
    sketch.rect(sketch.width/2, sketch.height/2, sketch.width, sketch.height);

    // Draw plottable area
    sketch.rectMode(sketch.CENTER);
    sketch.stroke(200);
    if (plotter_exceeded) {
      sketch.stroke(255,0,0,128);
    }
    sketch.strokeWeight(1);
    sketch.fill(215, 215, 215);
    if (env.table.format == "cartesian") {
      sketch.rect(sketch.width/2, sketch.height/2, (max_x/648) * sketch.width, (max_y/648) * sketch.height);
    } else if (env.table.format == "polar") {
      sketch.ellipse(sketch.width/2, sketch.height/2, 2 * table_radius, 2 * table_radius);
    }

    // Draw crosshairs
    //*
    sketch.stroke(210);
    sketch.line(sketch.width/2, 0, sketch.width/2, sketch.height);
    sketch.line(0, sketch.height/2, sketch.width, sketch.height/2);
    sketch.noStroke();
    //*/

    // Draw Theta-Rho border
    if (env.table.format == "polar") {
      sketch.stroke(200);
      sketch.noFill();
      sketch.ellipse(sketch.width/2, sketch.height/2, Math.min((max_x - min_x), (max_y - min_y)), Math.min((max_x - min_x), (max_y - min_y)));

      if (coordinate_labels) {
        sketch.noStroke();
        sketch.fill(128, 128, 128)
        sketch.textAlign(sketch.LEFT);
        sketch.text("[1, 0]", sketch.width/2 + Math.min((max_x - min_x), (max_y - min_y))/2 + 2, sketch.height/2 + 4);
        // textAlign(sketch.RIGHT);
        // text("[1,π]", width/2 - min((max_x - min_x), (max_y - min_y))/2 - 2, height/2 + 4);
        sketch.textAlign(sketch.CENTER);
        sketch.text("[1, π/2]", sketch.width/2, table_radius - 60);
      }
    }

    // Display plotter area
    if (env.table.format == "cartesian") {
      if (coordinate_labels) {
        sketch.noStroke();
        sketch.fill(128, 128, 128)
        sketch.textAlign(sketch.LEFT);
        sketch.text("[0,0]", sketch.width/2 - (max_x - min_x)/2, sketch.height/2 + (max_y - min_y)/2 + 12);
        sketch.textAlign(sketch.RIGHT);
        sketch.text("[" + max_x + "," + max_y + "]", sketch.width/2 + (max_x - min_x)/2, sketch.height/2 - (max_y - min_y)/2 - 4);
      }
    }
  }

  /*
  Draw Path
  */
  function drawPath(path, pathWidth = 1, connected = true, animated = true, showPlotter = false) {

    const max_x = env.table.x.max;
    const min_x = env.table.x.min;
    const max_y = env.table.y.max;
    const min_y = env.table.y.min;

    sketch.noFill();
    sketch.stroke(128, 164, 200);
    sketch.strokeCap(sketch.ROUND);
    sketch.strokeWeight(pathWidth);

    // Maximum radius
    const max_r = Math.min(max_x - min_x, max_y - min_y) / 2;

    // Start transformation matrix
    sketch.push();
    sketch.scale(1, -1);
    sketch.translate(sketch.width/2, -sketch.height/2);

    let i_max = path.length;
    if (animated) {
      i_max = draw_iteration % path.length;
    }

    // Draw entire path
    sketch.stroke(240, 240, 240);
    sketch.beginShape();
    for (var i = 0; i < path.length; i++) {
      sketch.vertex(path[i][0], path[i][1]);
    }
    sketch.endShape();

    // Represent the plotter movements
    if (showPlotter) {

      // Draw XY Plotter arms
      // triangle(30, 75, 58, 20, 86, 75);
      if (env.table.format == "cartesian") {

        // X-axis
        sketch.stroke(0,0,0,16);
        sketch.line(
          -(max_x - min_x)/2 + ball_size/2, path[i_max][1],
          (max_x - min_x)/2, path[i_max][1]
        );
        sketch.fill(0,0,0,16);
        sketch.noStroke();

        // Left Triangle
        //*
        sketch.triangle(
          -(max_x - min_x)/2, path[i_max][1] - ball_size/2,
          -(max_x - min_x)/2, path[i_max][1] + ball_size/2,
          -(max_x - min_x)/2 + ball_size/2, path[i_max][1],
        );
        //*/

        // Right Triangle
        /*
        triangle(
          (max_x - min_x)/2, path[i_max][1] - ball_size/2,
          (max_x - min_x)/2, path[i_max][1] + ball_size/2,
          (max_x - min_x)/2 - ball_size/2, path[i_max][1],
        );
        //*/

        // Y-axis
        sketch.stroke(0,0,0,16);
        sketch.line(
          path[i_max][0], (max_y - min_y)/2,
          path[i_max][0], -(max_y - min_y)/2 + ball_size/2
        );
        sketch.fill(0,0,0,16);
        sketch.noStroke();

        // Top Triangle
        /*
        sketch.triangle(
          path[i_max][0] + ball_size/2, (max_y - min_y)/2,
          path[i_max][0] - ball_size/2, (max_y - min_y)/2,
          path[i_max][0], (max_y - min_y)/2 - ball_size/2
        )
        //*/

        // Bottom Triangle
        //*
        sketch.triangle(
          path[i_max][0] + ball_size/2, -(max_y - min_y)/2,
          path[i_max][0] - ball_size/2, -(max_y - min_y)/2,
          path[i_max][0], -(max_y - min_y)/2 + ball_size/2
        )
        //*/
      }

      // Draw Radial Plotter arm
      if (env.table.format == "polar") {
        sketch.stroke(0,0,0,16);
        let arm_radius = Math.min((max_x - min_x), (max_y - min_y))/2;
        let theta = Math.atan2(path[i_max][1], path[i_max][0]);
        sketch.line(
          (arm_radius - ball_size/2) * Math.cos(theta),
          (arm_radius - ball_size/2) * Math.sin(theta),
          -arm_radius * Math.cos(theta),
          -arm_radius * Math.sin(theta),
        );
        sketch.fill(0,0,0,16);
        sketch.noStroke();
        sketch.triangle(
          (arm_radius - ball_size/2) * Math.cos(theta), (arm_radius - ball_size/2) * Math.sin(theta),
          arm_radius * Math.cos(theta + (1/60) * Math.PI), arm_radius * Math.sin(theta + (1/60) * Math.PI),
          arm_radius * Math.cos(theta - (1/60) * Math.PI), arm_radius * Math.sin(theta - (1/60) * Math.PI)
        );
      }

      // Coordinate display

      sketch.noStroke();
      sketch.fill(128);

      sketch.push();
      sketch.scale(1, -1);

      if (env.table.format == "cartesian") {

        // X Value
        sketch.textAlign(sketch.CENTER);
        sketch.text(
          (path[i_max][0] + ((max_x - min_x) / 2)).toFixed(1),
          path[i_max][0],
          ((max_y - min_y) / 2) + 12
        );

        // Y Value
        sketch.textAlign(sketch.RIGHT);
        sketch.text(
          (path[i_max][1] + ((max_y - min_y) / 2)).toFixed(1),
          -(((max_x - min_x) / 2) + 2),
          -(path[i_max][1] - 4)
        );
      } else if (env.table.format == "polar") {
        sketch.textAlign(sketch.LEFT);
        let rho = (Math.sqrt(Math.pow(path[i_max][0],2) + Math.pow(path[i_max][1],2)) / max_r);
        let theta = Math.atan2(path[i_max][1], path[i_max][0])
        if (theta < 0) {
          theta = theta + 2 * Math.PI;
        }

        sketch.textAlign(sketch.RIGHT);
        sketch.text(
          "rho: " + rho.toFixed(2) + "\ntheta: " + theta.toFixed(2),
          max_r,
          max_r - 40,
        );

        /*
        // Move text with arm... this is too difficult to read
        sketch.textAlign(LEFT);
        sketch.text(
          "[" + rho + ", " + theta.toFixed(2) + "]",
          (max_r * Math.cos(theta) - 30) + (45 * Math.cos(theta)),
          (-max_r * Math.sin(theta) - (12 * Math.sin(theta))) + 6,
        );
        //*/
      }
      sketch.pop();

    }

    // Draw as a continuous, connected line (stroke color cannot change)
    if (connected) {

      // Draw animated path
      sketch.stroke(46, 200, 240);
      sketch.beginShape();
      for (let i = 0; i <= i_max; i++) {
        sketch.vertex(path[i][0], path[i][1]);
      }
      sketch.endShape();

      // Draw current point
      sketch.noStroke();
      if (animated) {
        sketch.fill(255,255,0,128);
        sketch.ellipse(path[i_max][0], path[i_max][1], ball_size/2, ball_size/2);
      }

    } else {

      // Draw as disconnected line segments. Stroke color can change with each segment

      let c = sketch.color(128, 24 * sketch.cos((i/path.length) * sketch.TWO_PI) + 164, 200);

      for (let i = 0; i < i_max; i++) {

        // Background stroke
        sketch.stroke(250);
        sketch.strokeCap(sketch.SQUARE);
        sketch.strokeWeight(pathWidth*4)
        sketch.line(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);

        // Gradiated Stroke
        sketch.strokeCap(sketch.PROJECT);
        sketch.strokeWeight(pathWidth)
        sketch.stroke(c);

        // Draw line segment
        sketch.line(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);
      }

      // Draw current point
      sketch.noStroke();
      if (animated) {
        sketch.fill(c);
        sketch.ellipse(path[i_max][0], path[i_max][1], ball_size/2, ball_size/2);
      }

    }

    // Draw startpoint. Do this at the end instead of the beginning so the path does
    // cover the starting point
    sketch.noStroke();
    sketch.fill(0,255,0,128);
    sketch.ellipse(path[0][0], path[0][1], ball_size/2, ball_size/2);

    // Draw endpoint
    sketch.noStroke();
    sketch.fill(255,0,0,128);
    sketch.ellipse(path[path.length-1][0], path[path.length-1][1], ball_size/2, ball_size/2);

    // End transformation matrix
    sketch.pop();
  }

  /**
   * Draw selected specs for the pattern configuration
   */
  function draw_pattern_config(pattern)
  {
    var base_unit = 12;

    sketch.noStroke();
    sketch.fill(255);
    sketch.textAlign(sketch.LEFT);

    // Render text
    sketch.push();
    sketch.translate(0.25 * base_unit, 0.25 * base_unit);
    sketch.text("Pattern: " + pattern.name, 0, base_unit)
    var j = 2.25 * base_unit;
    Object.keys(pattern.config).forEach(key => {
      // TODO: Extract value for all input types (checkbox, select, etc.)
      sketch.text(key + ": " + pattern.config[key].value, 0, j);
      j = j + (1.25 * base_unit);
    });
    sketch.pop();

    // Add footer with information about the site
    sketch.noStroke();
    sketch.fill(128,128,128);
    sketch.textAlign(sketch.CENTER);
    sketch.text('Created at https://markroland.github.io/sand-table-pattern-maker', sketch.width/2, sketch.height - 72);
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

    // draw_pattern_config(Patterns[selected_pattern]);

    // Download pattern image
    // TEMP: Disabled to avoid "Multiple Download" prompt
    // saveCanvas(filename, "png")

    // Download pattern G-code
    if (env.table.format == "cartesian") {
      sketch.save(createGcode(env, Patterns[selected_pattern], path, gCodeCommand), filename, "gcode");
    }

    // Download pattern Theta-Rho Track
    else if (env.table.format == "polar") {
      let thr_path = new thetaRho(env);
      sketch.save(thr_path.convert(path), filename, "thr");
    }
  }


});

/**
 * Check to see if the path exceeds the plotter dimensions
 */
function path_exceeds_plotter(path)
{

  if (!path) {
    return false;
  }

  // Define function to extract column from multidimensional array
  const arrayColumn = (arr, n) => arr.map(a => a[n]);

  // Get X and Y coordinates as an 1-dimensional array
  const x_coordinates = arrayColumn(path, 0);
  const y_coordinates = arrayColumn(path, 1);

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
  path.forEach(function(element) {
    var fp_last = filtered_path[filtered_path.length - 1];
    var step_distance = Math.sqrt(Math.pow(element[0] - fp_last[0], 2) + Math.pow(element[1] - fp_last[1], 2));
    if (step_distance > min_distance) {
      filtered_path.push(element);
    }
  });

  return filtered_path;
}

/**
 * Process key presses
 */
window.addEventListener('keydown', (event) => {
  if (event.key === 'c') {
    coordinate_overlay = !coordinate_overlay;
  } else if (event.key === 'd') {
    var selected_pattern = pattern_select.value();
    let path = Patterns[selected_pattern].draw();
    imagePath(path);
  } else if (event.key === 'o') {
    pattern_config_overlay = !pattern_config_overlay;
  }
});

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

  // Loop through configuration and create query string
  // Uncommenting for now because these are not being read in
  /*
  const entries = Object.entries(Patterns[selected_pattern].config)
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
