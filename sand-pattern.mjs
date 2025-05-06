#!/usr/bin/env node

// Pattern Generator

import minimist from 'minimist';

import env from './src/js/env.js';
import Circle from './src/js/patterns/Circle.js';

// Parse arguments
const argv = minimist(process.argv.slice(2));

let Pattern;

switch(argv.pattern) {
  case 'circle':
    const MyCircle = new Circle(env);
    Pattern = MyCircle.calc(0, 0, 100, 0);
    console.log(Pattern);
    break;
  default:
    console.log("Please use the `pattern` argument to set the shape. One of: circle")
    process.exit(1);
}

// console.log(Pattern.path());
