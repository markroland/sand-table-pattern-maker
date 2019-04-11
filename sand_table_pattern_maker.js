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

  spiral_sides = createSlider(3, 60, 3);
  spiral_sides.position(10, 700);
  spiral_sides.style('width', '400px');

  spiral_offset = createSlider(1, 40, 20);
  spiral_offset.position(10, 720);
  spiral_offset.style('width', '400px');

  spiral_twist = createSlider(1, 2, 1, 0.001);
  spiral_twist.position(10, 740);
  spiral_twist.style('width', '400px');
  
  // Download controls
  downloadButton = createButton('Download');
  downloadButton.parent('sketch-holder');
  downloadButton.mousePressed(download);
}

function draw() {

  // Draw the background
  background(255);
  drawTable();

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
  
