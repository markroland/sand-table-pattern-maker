const fs = require('fs');
const path = require('path');
const newFileName = process.argv[2];
if (!newFileName) {
  console.error('Please provide a file name as the first argument.');
  process.exit(1);
}
const srcPath = path.join(__dirname, '../src/js/patterns/SpiralZigZag.js');
const destPath = path.join(__dirname, `../src/js/patterns/${newFileName}.js`);

fs.copyFile(srcPath, destPath, (err) => {

  if (err) {
    console.error('Error copying file:', err);
    process.exit(1);
  }

  // Use SpiralZigZag as a template
  let content = fs.readFileSync(destPath, 'utf8');
  content = content.replace('class SpiralZigZag', `class ${newFileName}`);
  content = content.replace('export default SpiralZigZag', `export default ${newFileName}`);
  fs.writeFileSync(destPath, content, 'utf8');

  // Update index.js programmatically using the newFileName variable
  const indexPath = path.join(__dirname, '../src/js/patterns/index.js');
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Update the import block (excluding env import)
  const importBlockRegex = /((?:import (?!env).+from\s+['"].+['"];[\r\n])+)/;
  let importBlockMatch = indexContent.match(importBlockRegex);
  if (importBlockMatch) {
    let importLines = importBlockMatch[1].split('\n').filter(line => line.trim() !== '');
    importLines.push(`import ${newFileName} from './${newFileName}.js';`);
    importLines.sort((a, b) => {
      const nameA = a.match(/import\s+(\S+)\s+/)[1].toLowerCase();
      const nameB = b.match(/import\s+(\S+)\s+/)[1].toLowerCase();
      return nameA.localeCompare(nameB);
    });
    const newImportBlock = importLines.join('\n') + '\n';
    indexContent = indexContent.replace(importBlockRegex, newImportBlock);
  }

  // Update the Patterns object block
  const patternBlockRegex = /(const Patterns = {\s*)([\s\S]*?)(\s*}\s*)/m;
  let patternBlockMatch = indexContent.match(patternBlockRegex);
  if(patternBlockMatch) {
    const before = patternBlockMatch[1];
    let patternLines = patternBlockMatch[2].split('\n').filter(line => line.trim() !== '');
    const after = patternBlockMatch[3];
    patternLines.push(`  "${newFileName.toLowerCase()}": new ${newFileName}(env),`);
    patternLines.sort((a, b) => {
      const keyA = a.match(/"([^"]+)"/)[1].toLowerCase();
      const keyB = b.match(/"([^"]+)"/)[1].toLowerCase();
      return keyA.localeCompare(keyB);
    });
    const newPatternBlock = before + patternLines.join('\n') + after;
    indexContent = indexContent.replace(patternBlockRegex, newPatternBlock);
  }

  fs.writeFileSync(indexPath, indexContent, 'utf8');
});