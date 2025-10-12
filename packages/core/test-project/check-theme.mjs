console.log('Hello World');
console.log('Testing theme import...');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查文件是否存在
const themePath = path.join(__dirname, '../dist/theme.mjs');
console.log('Theme path:', themePath);
console.log('File exists:', fs.existsSync(themePath));

if (fs.existsSync(themePath)) {
  const content = fs.readFileSync(themePath, 'utf8');
  console.log('File content length:', content.length);
  console.log('First 200 chars:', content.substring(0, 200));
}