import PathHelper from '@markroland/path-helper'

class Curvature {

  constructor(env) {
    this.key = "curvature";
    this.name = "Curvature";
    this.env = env;
    this.config = {};
    this.path = [];
  }

  draw() {

    const PathHelp = new PathHelper();

    const max_r = 0.5 * Math.min(
      (this.env.table.x.max - this.env.table.x.min),
      (this.env.table.y.max - this.env.table.y.min)
    );

    // Create a circle
    let path = PathHelp.polygon(60, 0.5 * max_r);

    // Simplify decimal precision
    path = path.map(function(point) {
      return point.map(function(number) {
        return parseFloat(number.toFixed(2));
      });
    });

    return path;
  }
}

export default Curvature;