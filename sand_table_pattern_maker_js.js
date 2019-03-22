/*
  Sand Table Pattern Maker

  20 MAR 2019

  This is a rewrite/refactor of my original Java sketches

*/

// Plotter settings (mm)
var max_x = 472.0;
var max_y = 380.0;

function setup() {

  var canvas = createCanvas(648, 648);

  // Move the canvas so it’s inside our <div id="sketch-holder">
  canvas.parent('sketch-holder');

  background(255);

}


function draw() {

  // Draw the background
  background(255);
  drawTable();

}
