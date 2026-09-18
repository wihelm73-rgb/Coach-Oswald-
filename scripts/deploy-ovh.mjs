// Déploie le contenu de dist/ sur l'hébergement OVH via FTP ou SFTP,
// selon les paramètres du fichier .env (voir .env.example).
// Usage : npm run deploy:ovh   (lance d'abord `npm run build` si dist/ est absent)
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import 'dotenv/config';

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist');

const {
  OVH_PROTOCOL = 'ftp',
  OVH_HOST,
  OVH_PORT,
  OVH_USER,
  OVH_PASSWORD,
  OVH_REMOTE_PATH,
} = process.env;

function requireEnv() {
  const missing = ['OVH_HOST', 'OVH_USER', 'OVH_PASSWORD', 'OVH_REMOTE_PATH'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `Variables .env manquantes : ${missing.join(', ')}\n` +
      'Copier .env.example vers .env et renseigner les accès OVH avant de déployer.'
    );
    process.exit(1);
  }
}

async function deployFtp() {
  const ftp = await import('basic-ftp');
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: OVH_HOST,
      port: OVH_PORT ? Number(OVH_PORT) : 21,
      user: OVH_USER,
      password: OVH_PASSWORD,
      secure: false,
    });
    await client.ensureDir(OVH_REMOTE_PATH);
    console.log(`Envoi FTP de dist/ vers ${OVH_HOST}:${OVH_REMOTE_PATH} ...`);
    await client.uploadFromDir(distDir);
    console.log('Déploiement FTP terminé.');
  } finally {
    client.close();
  }
}

async function deploySftp() {
  const { default: SftpClient } = await import('ssh2-sftp-client');
  const sftp = new SftpClient();
  try {
    await sftp.connect({
      host: OVH_HOST,
      port: OVH_PORT ? Number(OVH_PORT) : 22,
      username: OVH_USER,
      password: OVH_PASSWORD,
    });
    console.log(`Envoi SFTP de dist/ vers ${OVH_HOST}:${OVH_REMOTE_PATH} ...`);
    await sftp.uploadDir(distDir, OVH_REMOTE_PATH);
    console.log('Déploiement SFTP terminé.');
  } finally {
    await sftp.end();
  }
}

requireEnv();

if (!existsSync(distDir)) {
  console.log('dist/ absent — build en cours (npm run build)...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
}

if (OVH_PROTOCOL === 'sftp') {
  await deploySftp();
} else if (OVH_PROTOCOL === 'ftp') {
  await deployFtp();
} else {
  console.error(`OVH_PROTOCOL invalide : "${OVH_PROTOCOL}" (attendu "ftp" ou "sftp")`);
  process.exit(1);
}
