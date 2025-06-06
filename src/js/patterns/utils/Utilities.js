import PathHelper from '@markroland/path-helper'

export function spiral(r1, r2, n, sides) {

  let path = [];

  const PathHelp = new PathHelper();

  const stepSize = (2 * Math.PI * r1) / sides; // Approximate step size based on initial radius
  let theta = 0;
  let r = r1;

  while (r >= r2) {
    path.push([
      r * Math.cos(theta),
      r * Math.sin(theta),
    ]);

    theta += stepSize / r; // Increment angle based on step size
    r = r1 + (theta / (2 * Math.PI * n)) * (r2 - r1); // Increment radius proportionally
  }

  // path = PathHelp.simplify(path, stepSize);

  // const theta1 = 0;
  // const theta2 = n * 2 * Math.PI;
  // const i_max = n * sides;
  // for (let i = 0; i <= i_max; i++) {
  //   const r = r1 + (i/i_max) * (r2 - r1);
  //   const theta = theta1 + (i/i_max) * (theta2 - theta1);

  //   path.push([
  //     r * Math.cos(theta),
  //     r * Math.sin(theta),
  //   ]);
  // }

  // path = PathHelp.simplify(path, step_size);

  return path;
}

export function zigZag(path, offset) {

  const PathHelp = new PathHelper();

  let innerPath = PathHelp.offsetPath(path, -offset);

  // Need this for closed shapes:
  // innerPath = PathHelp.shiftPath(innerPath, 2);
  // innerPath.push(innerPath[0]);
  // innerPath.splice(1, 1);

  let outerPath = PathHelp.offsetPath(path, offset);

  // Need this for closed shapes:
  // outerPath = PathHelp.shiftPath(outerPath, 2);
  // outerPath.push(outerPath[0]);
  // outerPath.splice(1, 1);

  // ZigZag
  let newPath = [];
  for (let i = 0; i < path.length; i++) {
    if (i % 2 === 0) {
      newPath.push(innerPath[i]);
      newPath.push(outerPath[i]);
    } else {
      newPath.push(outerPath[i]);
      newPath.push(innerPath[i]);
    }
  }
  path = newPath;

  return newPath;
}

/**
 * This may not do quite what I want it to do.
 */
export function arcBetweenPoints(x1, y1, x2, y2, step_size) {

  const PathHelp = new PathHelper();

  let path = [[x1, y1]];

  const r1 = Math.sqrt(x1 * x1 + y1 * y1);
  const theta1 = Math.atan2(y1, x1);

  const r2 = Math.sqrt(x2 * x2 + y2 * y2);
  const theta2 = Math.atan2(y2, x2);

  const i_max = 1000;
  for (let i = 0; i < i_max; i++) {

    const r  = r1 + (i/i_max) * (r2 - r1);
    const theta = theta1 + (i/i_max) * (theta2 - theta1);

    path.push([
      r * Math.cos(theta),
      r * Math.sin(theta),
    ]);
  }

  path = PathHelp.simplify(path, step_size);

  return path;
}
