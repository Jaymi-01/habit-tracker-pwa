import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'public');
const destDir = path.join(process.cwd(), 'public');

if (fs.existsSync(srcDir)) {
  console.log(`Syncing ${srcDir} to ${destDir}...`);
  fs.cpSync(srcDir, destDir, { recursive: true, force: true });
} else {
  console.log(`Source directory ${srcDir} does not exist. Skipping sync.`);
}
