// Zippe le dossier dist/ (build de production) dans releases/coach-oswald-<timestamp>.zip
// Usage : npm run archive   (lance d'abord `npm run build` si dist/ est absent)
import { existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import archiver from 'archiver';
import { createWriteStream } from 'node:fs';

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist');
const releasesDir = path.join(root, 'releases');

if (!existsSync(distDir)) {
  console.log('dist/ absent — build en cours (npm run build)...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

if (!existsSync(releasesDir)) mkdirSync(releasesDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const archivePath = path.join(releasesDir, `coach-oswald-${stamp}.zip`);

const output = createWriteStream(archivePath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Archive créée : ${archivePath} (${(archive.pointer() / 1024).toFixed(1)} Ko)`);
  console.log(archivePath); // dernière ligne = chemin, exploitable par un script appelant
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
