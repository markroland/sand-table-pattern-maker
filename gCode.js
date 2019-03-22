/**
 * Combine G-Code headers, foofer and path
*/
function createGcode(path) {
  var gcode = gCodeHeader();
  
  // Compose start command(s)
  gcode = concat(gcode, gCodeStart());
  
  // Compose G-code path
  for (i = 0; i < path.length; i++) {

    gcode.push("G0 X" + nf(path[i][0] + max_x/2,0,2) + " Y" + nf(path[i][1] + max_y/2,0,2));
  }
  
  // Compose end command(s)
  gcode = concat(gcode, gCodeFinish());
  
  return gcode;
}

/**
 * Header Content for the  G-code file
 */
function gCodeHeader() {
  return [
    "; Created by Processing 'sand_table_js' sketch",
    "; " + month() + "/" + day() + "/" + year() + " " + hour() + ":" + minute() + ":" + second(),
    "; Written by Mark Roland",
    ";",
    "; Machine Specifications:",
    "; ",
    "; Min X: 0",
    "; Max X: " + max_x,
    "; Min Y: 0",
    "; Max Y: " + max_y,
    "; Motor Speed (mm/min): " + motor_speed,
    "; ",
    "; Pattern Specifications:",
    "; ",
    "; Shape: Spiral",
    "; Parameters:",
    ";   A: 1",
    ";   B: 2",
    "; ",
    "; Pattern Distance (mm): " + nfc(distance, 1),
    "; Pattern Draw Time (minutes): " + nfc(distance / motor_speed, 1),
    ""
  ];
}

/**
 * Startup commands for the G-code file
 */
function gCodeStart() {
  return [
    "",
    "; Custom G-code to execute before the start of the sketch",
    "",
    // Insert your code here
  ];
}

/**
 * Finishing commands for the G-code file
 */
function gCodeFinish() {
  return [
    "",
    "; Custom G-code to execute after the end of the sketch",
    "",
    // Insert your code here
  ];
}
