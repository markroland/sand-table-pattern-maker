import env from './../env.js';

import Coordinates from './Coordinates.js';
import Circle from './Circle.js';
import Cross from './Cross.js';
import Curvature from './Curvature.js';
import Cycloid from './Cycloid.js';
import Diameters from './Diameters.js';
import Draw from './Draw.js';
import Egg from './Egg.js';
import Farris from './Farris.js';
import FermatSpiral from './FermatSpiral.js';
import Fibonacci from './Fibonacci.js';
import FibonacciLollipops from './FibonacciLollipops.js';
import Frame from './Frame.js';
import Gcode from './Gcode.js';
import Gravity from './Gravity.js';
import Heart from './Heart.js';
import Lindenmayer from './Lindenmayer.js';
import Lissajous from './Lissajous.js';
import Sunset from './Sunset.js';
import LogarithmicSpiral from './LogarithmicSpiral.js';
import Parametric from './Parametric.js';
import Rectangle from './Rectangle.js';
import Rhodonea from './Rhodonea.js';
import ShapeMorph from './ShapeMorph.js';
import ShapeSpin from './ShapeSpin.js';
import Spiral from './Spiral.js';
import SpiralZigZag from './SpiralZigZag.js';
import Spokes from './Spokes.js';
import Star from './Star.js';
import Superellipse from './Superellipse.js';
import Text from './Text.js';
import ThetaRhoInput from './ThetaRhoInput.js';
import WigglySpiral from './WigglySpiral.js';
import ZigZag from './ZigZag.js';

const Patterns = {
  "coordinates": new Coordinates(),
  "circle": new Circle(env),
  "curvature": new Curvature(env),
  "cross": new Cross(env),
  "cycloid": new Cycloid(env),
  "diameters": new Diameters(env),
  "draw": new Draw(env),
  "egg": new Egg(env),
  "farris": new Farris(env),
  "fermatspiral": new FermatSpiral(env),
  "fibonacci": new Fibonacci(env),
  "fibonaccilollipops": new FibonacciLollipops(env),
  "frame": new Frame(env),
  "gcode": new Gcode(env),
  "gravity": new Gravity(env),
  "heart": new Heart(),
  "lindenmayer": new Lindenmayer(env),
  "lissajous": new Lissajous(env),
  "parametric": new Parametric(),
  "rectangle": new Rectangle(env),
  "rhodonea": new Rhodonea(env),
  "shapemorph": new ShapeMorph(env),
  "shapespin": new ShapeSpin(),
  "spiral": new Spiral(env),
  "spiralzigzag": new SpiralZigZag(env),
  "sunset": new Sunset(env),
  "logspiral": new LogarithmicSpiral(env),
  "spokes": new Spokes(env),
  "star": new Star(env),
  "superellipse": new Superellipse(env),
  "text": new Text(env),
  "thr": new ThetaRhoInput(env),
  "wigglyspiral": new WigglySpiral(env),
  "zigzag": new ZigZag(env)
}

export default Patterns;