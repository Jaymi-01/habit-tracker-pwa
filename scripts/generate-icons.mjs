import fs from 'fs';
import path from 'path';

const iconsDir = path.join(process.cwd(), 'src', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// A valid 1x1 emerald PNG
const base64Icon = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88f9fAAMEAgH+45vXAAAAAElFTkSuQmCC';
const buffer = Buffer.from(base64Icon, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), buffer);

console.log('Valid PNG icon placeholders created.');
