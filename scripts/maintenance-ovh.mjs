// Bascule le site en mode maintenance : envoie public/maintenance.html en tant que
// index.html sur l'hébergement OVH, SANS toucher au reste des fichiers déjà en ligne
// (contrairement à `npm run deploy:ovh`, qui envoie tout le contenu de dist/).
// Usage : npm run maintenance:on
//
// Pour repasser le site en ligne normalement : `npm run deploy:ovh` (ou la commande
// `/deployer`) réécrase index.html avec le vrai build — pas de script "off" séparé.
import { existsSync } from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const root = path.resolve(import.meta.dirname, '..');
const maintenancePage = path.join(root, 'public', 'maintenance.html');

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

function remoteIndexPath() {
  return `${OVH_REMOTE_PATH.replace(/\/+$/, '')}/index.html`;
}

async function activateFtp() {
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
    console.log(`Envoi FTP de maintenance.html vers ${OVH_HOST}:${remoteIndexPath()} ...`);
    await client.uploadFrom(maintenancePage, 'index.html');
    console.log('Page de maintenance active.');
  } finally {
    client.close();
  }
}

async function activateSftp() {
  const { default: SftpClient } = await import('ssh2-sftp-client');
  const sftp = new SftpClient();
  try {
    await sftp.connect({
      host: OVH_HOST,
      port: OVH_PORT ? Number(OVH_PORT) : 22,
      username: OVH_USER,
      password: OVH_PASSWORD,
    });
    console.log(`Envoi SFTP de maintenance.html vers ${OVH_HOST}:${remoteIndexPath()} ...`);
    await sftp.put(maintenancePage, remoteIndexPath());
    console.log('Page de maintenance active.');
  } finally {
    await sftp.end();
  }
}

requireEnv();

if (!existsSync(maintenancePage)) {
  console.error(`Fichier introuvable : ${maintenancePage}`);
  process.exit(1);
}

if (OVH_PROTOCOL === 'sftp') {
  await activateSftp();
} else if (OVH_PROTOCOL === 'ftp') {
  await activateFtp();
} else {
  console.error(`OVH_PROTOCOL invalide : "${OVH_PROTOCOL}" (attendu "ftp" ou "sftp")`);
  process.exit(1);
}
