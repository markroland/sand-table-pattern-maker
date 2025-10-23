import env from './../env.js';

import Circle from './Circle.js';
import Coordinates from './Coordinates.js';
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
import Flower from './Flower.js';
import Frame from './Frame.js';
import Gcode from './Gcode.js';
import Gravity from './Gravity.js';
import Heart from './Heart.js';
import Lindenmayer from './Lindenmayer.js';
import Lissajous from './Lissajous.js';
import LogarithmicSpiral from './LogarithmicSpiral.js';
import Parametric from './Parametric.js';
import Rectangle from './Rectangle.js';
import Rhodonea from './Rhodonea.js';
import ShapeMorph from './ShapeMorph.js';
import ShapeSpin from './ShapeSpin.js';
import SineWaves from './SineWaves.js';
import SpinMorph from './SpinMorph.js';
import Spiral from './Spiral.js';
import SpiralZigZag from './SpiralZigZag.js';
import Spokes from './Spokes.js';
import Star from './Star.js';
import Sunset from './Sunset.js';
import Superellipse from './Superellipse.js';
import Text from './Text.js';
import ThetaRhoInput from './ThetaRhoInput.js';
import WigglySpiral from './WigglySpiral.js';
import ZigZag from './ZigZag.js';

const Patterns = {
  "circle": new Circle(env),
  "coordinates": new Coordinates(),
  "cross": new Cross(env),
  "curvature": new Curvature(env),
  "cycloid": new Cycloid(env),
  "diameters": new Diameters(env),
  "draw": new Draw(env),
  "egg": new Egg(env),
  "farris": new Farris(env),
  "fermatspiral": new FermatSpiral(env),
  "fibonacci": new Fibonacci(env),
  "fibonaccilollipops": new FibonacciLollipops(env),
  "flower": new Flower(env),
  "frame": new Frame(env),
  "gcode": new Gcode(env),
  "gravity": new Gravity(env),
  "heart": new Heart(),
  "lindenmayer": new Lindenmayer(env),
  "lissajous": new Lissajous(env),
  "logspiral": new LogarithmicSpiral(env),
  "parametric": new Parametric(),
  "rectangle": new Rectangle(env),
  "rhodonea": new Rhodonea(env),
  "shapemorph": new ShapeMorph(env),
  "shapespin": new ShapeSpin(),
  "sinewaves": new SineWaves(env),
  "spinmorph": new SpinMorph(env),
  "spiral": new Spiral(env),
  "spiralzigzag": new SpiralZigZag(env),
  "spokes": new Spokes(env),
  "star": new Star(env),
  "sunset": new Sunset(env),
  "superellipse": new Superellipse(env),
  "text": new Text(env),
  "thr": new ThetaRhoInput(env),
  "wigglyspiral": new WigglySpiral(env),
  "zigzag": new ZigZag(env)
}

export default Patterns;