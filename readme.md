# Sand Table Pattern Maker

![Sand Table](sand_table_pattern_maker.jpg)

[Launch Pattern Maker](https://markroland.github.io/sand-table-pattern-maker/)

This is part of my [Sand Table Build](https://markroland.com/portfolio/sand-table)

Built with [p5.js](https://p5js.org)

## Controls

 - Press "o" to toggle an overlay of the pattern settings in the canvas
 - Press "c" to toggle the live coordinates and plotter mechanism view

## How to Build a New Pattern

In order to build a new pattern a few things must be done:

1. Create a Pattern Class and save it to the `assets/js/patterns` folder
2. Link to Pattern Class file in `index.html`
3. Add the Pattern Class to the `Patterns` config in the main sketch file (`sand_table_pattern_maker.js`).
   This object must have a key that matches the class's `this.key` value and the object value
   must be a Class instantiation.

Pattern classes are made up of at least 4 methods:

 - **constructor** - The class constructor defines a few aspect of the class including:
   - `this.key` - Used for identifying the class's properties in the main sketch file
   - `this.name` - Used for referencing the pattern in the UI.
   - `this.config` - This is an object that defines the pattern's input configuration options.
   - `this.path` - Initializes the pattern's output path coordinates
 - **draw** - This class is called by the main sketch to draw the pattern. It reads and
   updates the UI input values and sends the input to the class's `calc` method.
 - **calc** - This is where the algorithm for the pattern is implemented. Using the selected
   inputs, the method returns the coordinates for the complete path.


## Patterns

- XY Coordinates
- Circle
- Cross
- Cycloid ([Epicycloid](https://en.wikipedia.org/wiki/Epicycloid), [Hypocycloid](https://en.wikipedia.org/wiki/Hypocycloid), [Hypotrochoid](https://en.wikipedia.org/wiki/Hypotrochoid))
- Diameters
- Free Draw
- Easter Eggs ([Reference](https://math.stackexchange.com/questions/3375853/parametric-equations-for-a-true-egg-shape))
- Farris Curve ([Reference](http://www.sineofthetimes.org/the-art-of-parametric-equations-2/))
- Fermat's Spiral ([Reference](https://en.wikipedia.org/wiki/Fermat%27s_spiral))
- Fibonacci
- Fibonacci Lollipops
- Frames (Border Patterns)
- G-Code
- Gravity
- Heart ([Reference](http://mathworld.wolfram.com/HeartCurve.html))
- Space Filling Curves \[[1](https://p5js.org/examples/simulate-l-systems.html)\] \[[2](https://en.wikipedia.org/wiki/Space-filling_curve)\] \[[3](https://fedimser.github.io/l-systems.html)\]
- Lissajous Curve ([Lissajous Curves](https://en.wikipedia.org/wiki/Lissajous_curve))
- Parametric ([Butterfly Curve](https://en.wikipedia.org/wiki/Butterfly_curve_(transcendental)))
- Rectangle
- Rhodonea (Rose) Curve ([Rose Curve](https://en.wikipedia.org/wiki/Rose_(mathematics)))
- Shape Morph
- Shape Spin
- Spiral
- Spiral (Logarithmic) ([Reference](https://en.wikipedia.org/wiki/Logarithmic_spiral))
- Spokes
- Star
- Superellipse \[[1](https://en.wikipedia.org/wiki/Superellipse)\] \[[2](https://mathworld.wolfram.com/Superellipse.html)\] \[[3](https://thecodingtrain.com/CodingChallenges/019-superellipse.html)\]
- Text
- Theta Rho Coordinates
- Wiggly Spiral
- Zig Zag

## License

[![Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://i.creativecommons.org/l/by-nd/2.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

This work is licensed under a [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/) License.

This work makes use of [p5.js](https://p5js.org), which carries a [GNU Lesser General Public License](https://p5js.org/copyright.html).
