/*
  Sand Table Pattern Maker

  20 MAR 2019

  This is a rewrite/refactor of my original Java sketches
*/

// Plotter settings (mm)
var max_x = 472.0;
var max_y = 380.0;

// Set motor speed in mm/min
var motor_speed = 6000.0;

// Width/Diameter of print head (steel ball) used for etching pattern (mm)
var ball_size = 19.0;

// Store the coordinates for the path
var path;

// Store the total path distance
var distance;

function setup() {

  var canvas = createCanvas(648, 648);

  // Move the canvas so it’s inside our <div id="sketch-holder">
  canvas.parent('sketch-holder');

  background(255);

  // Sides controls
  sides = createDiv('Sides');
  sides.parent('sketch-holder');
  spiral_sides = createSlider(3, 60, 3);
  spiral_sides.parent(sides);
  spiral_sides.style('width', '400px');
  sides_value = createSpan('0');
  sides_value.parent(sides);

  // Offset control
  offset = createDiv('Offset');
  offset.parent('sketch-holder');
  spiral_offset = createSlider(1, 40, 20);
  spiral_offset.parent(offset);
  spiral_offset.style('width', '400px');
  offset_value = createSpan('0');
  offset_value.parent(offset);

  // Twist controls
  twist_div = createDiv('Twist');
  twist_div.parent('sketch-holder');
  spiral_twist = createSlider(1, 1.112, 1, 0.001);
  spiral_twist.parent(twist_div);
  spiral_twist.style('width', '400px');
  twist_value = createSpan('0');
  twist_value.parent(twist_div);
  
  // Download controls
  downloadButton = createButton('Download');
  downloadButton.parent('sketch-holder');
  downloadButton.mousePressed(download);
}

function draw() {

  // Draw the background
  background(255);
  drawTable();

  // Draw control selection values
  sides_value.html(spiral_sides.value());
  offset_value.html(spiral_offset.value());
  twist_value.html(spiral_twist.value());

  // Calculate the path
  path = calcSpiral(spiral_offset.value(), spiral_sides.value(), spiral_twist.value());

  // Draw the path
  drawPath(path);
}

function keyTyped()
{

  // Note: Safari browser doesn't appear to allow multiple downloads. Chrome does.
  if (key === 's') {
    download();
  }
}

function download()
{

  // Download pattern image
  saveCanvas("pattern", "png")
    
  // Download pattern G-code
  save(createGcode(path), "pattern", "gcode"); 
}
  
