/**
 * Combine G-Code headers, footer and path
*/
function createGcode(env, pattern, path, gCommand = "G0") {

  // Get G-Code header
  var gcode = gCodeHeader(env, pattern);

  // Compose start command(s)
  gcode = gcode.concat(gCodeStart());

  // Compose G-code path
  gcode = gcode.concat("; G-code path");
  for (let i = 0; i < path.length; i++) {
    gcode.push(gCommand + " X" + (path[i][0] + env.table.x.max/2).toFixed(2) + " Y" + (path[i][1] + env.table.y.max/2,0,2).toFixed(2));
  }

  // Compose end command(s)
  gcode = gcode.concat(gCodeFinish());

  return gcode;
}

/**
 * Header Content for the  G-code file
 */
function gCodeHeader(env, pattern) {

  var header = [
    "; Created using https://markroland.github.io/sand-table-pattern-maker/",
    ";",
    "; " + (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
    ";",
    "; Machine Specifications:",
    ";",
    "; Units: " + env.table.units,
    ";",
    "; Min X: " + env.table.x.min,
    "; Max X: " + env.table.x.max,
    "; Min Y: " + env.table.y.min,
    "; Max Y: " + env.table.y.max,
    "; Motor Speed (" + env.table.units + "/min): " + env.motor.speed,
    ";",
    "; Pattern Specifications:",
    ";",
    "; Name: " + pattern.name,
    ";",
    "; Parameters:"
  ];

  // Add pattern parameters
  const entries = Object.entries(pattern.config)
  for (const [param, content] of entries) {
    header = header.concat([`; - ${param}: ${content}`]);
  }

  header = header.concat([
    ";",
    "; URL: " + window.location,
    ";",
    // "; Pattern Distance (" + env.table.units + "): " + distance.toFixed(1),
    // "; Pattern Draw Time (minutes): " + (distance / motor_speed).toFixed(1),
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

export default createGcode;