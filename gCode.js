/**
 * Combine G-Code headers, footer and path
*/
function createGcode(path, gCommand = "G0") {

  // Get G-Code header
  var gcode = gCodeHeader();

  // Compose start command(s)
  gcode = concat(gcode, gCodeStart());

  // Compose G-code path
  for (i = 0; i < path.length; i++) {
    gcode.push(gCommand + " X" + nf(path[i][0] + max_x/2,0,2) + " Y" + nf(path[i][1] + max_y/2,0,2));
  }

  // Compose end command(s)
  gcode = concat(gcode, gCodeFinish());

  return gcode;
}

/**
 * Header Content for the  G-code file
 */
function gCodeHeader() {

  var header = [
    "; Created using https://markroland.github.io/sand-table-pattern-maker/",
    ";",
    "; " + month() + "/" + day() + "/" + year() + " " + hour() + ":" + minute() + ":" + second(),
    ";",
    "; Machine Specifications:",
    ";",
    "; Units: " + units,
    ";",
    "; Min X: 0",
    "; Max X: " + max_x,
    "; Min Y: 0",
    "; Max Y: " + max_y,
    "; Motor Speed (" + units + "/min): " + motor_speed,
    ";",
    "; Pattern Specifications:",
    ";",
    "; Name: " + Patterns.circle.name,
    ";",
    "; Parameters:"
  ];

  // Add pattern parameters
  const entries = Object.entries(Patterns.circle.config)
  for (const [param, content] of entries) {
    header = header.concat([`; - ${param}: ${content}`]);
  }

  header = header.concat([
    ";",
    "; URL: " + window.location,
    ";",
    "; Pattern Distance (" + units + "): " + nfc(distance, 1),
    "; Pattern Draw Time (minutes): " + nfc(distance / motor_speed, 1),
    ""
  ]);

  return header;
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
