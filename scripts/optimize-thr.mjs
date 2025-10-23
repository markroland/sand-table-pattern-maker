import fs from 'fs';
import readline from 'readline';
import path from 'path';

// Add definition for __dirname in ES modules
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Get file path from command line arguments
const filePath = process.argv[2];

// Set the environment dimensions
const ball_diameter_mm = 10;
const table_diameter_mm = 406;

// Calculate the normalized resolution (where 1.0 is the full radius of the table)
const norm_distance_threshold = ((0.5 * ball_diameter_mm) / (0.5 * table_diameter_mm)).toFixed(3);

if (!filePath) {
  console.error('Usage: node optimize-thr.js <path-to-file.thr>');
  process.exit(1);
}

console.log(`Ball Diameter: ${ball_diameter_mm}mm`);
console.log(`Table Diameter: ${table_diameter_mm}mm`);
console.log(`Normalized Threshold: ${norm_distance_threshold}`);

// Create a readable stream and readline interface
const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity
});

let prevTheta = null;
let prevRho = null;
let old_instruction_count = 0;
let new_instruction_count = 0;

let new_path = [];

rl.on('line', (line) => {

  // Preserve comment lines
  if (line.startsWith('#')) {
    new_path.push([line]);
    return;
  }

  // Skip lines that aren't position data
  const match = line.match(/^([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)/);
  if (!match) {
    new_path.push([line]);
    return;
  }

  // Count old lines
  old_instruction_count++;

  // Parse data from line
  const [, num1Str, num2Str] = match;
  const theta = parseFloat(num1Str);
  const rho = parseFloat(num2Str);

  // First data point
  if (prevTheta === null && prevRho === null) {
    new_path.push([theta, rho]);
    new_instruction_count++;
    prevTheta = theta;
    prevRho = rho;
    return;
  }

  // Calculate distance between two polar points
  const distance = Math.sqrt(
    prevRho * prevRho + rho * rho - 2 * prevRho * rho * Math.cos(theta - prevTheta)
  );

  if (distance > norm_distance_threshold) {
    new_path.push([theta, rho]);
    new_instruction_count++;
    prevTheta = theta;
    prevRho = rho;
  }
});

rl.on('close', () => {

  // Transform new_path: combine each coordinate pair into a string with a space separator.
  // Comments are already stored as single-element arrays, so they'll just be output as-is
  const combinedPath = new_path.map(pair => pair.length === 1 ? pair[0] : pair.join(' '));

  // Determine output file path: same directory as input file but with a .opt.thr extension.
  const parsedPath = path.parse(filePath);
  const outputFilePath = path.join(parsedPath.dir, parsedPath.name + '.opt.thr');

  // Write one line per coordinate pair with "number space number"
  fs.writeFileSync(outputFilePath, combinedPath.join('\n'), 'utf8');

  // Calculate percentage reduction (guard against division by zero)
  let reduction = 0;
  if (old_instruction_count > 0) {
    reduction = ((old_instruction_count - new_instruction_count) / old_instruction_count) * 100;
    reduction = Math.round(reduction);
  }

  // Print info
  console.log(`Original Point Count: ${old_instruction_count.toLocaleString()}`);
  console.log(`Optimized Point Count: ${new_instruction_count.toLocaleString()}`);
  console.log(`Reduced by ${reduction}%`)
  console.log(`Saved to ${outputFilePath}`);
});