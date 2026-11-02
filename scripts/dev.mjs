import { spawn } from 'child_process';

console.log('🚀 Starting OMEGA Full-Stack Environment (Vite + Backend API)...');

const isWin = process.platform === 'win32';
const server = spawn('node', ['server/server.mjs'], {
  stdio: 'inherit',
  shell: true,
});

const vite = spawn(isWin ? 'npx.cmd' : 'npx', ['vite', '--port=3000', '--host=0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  try { server.kill(); } catch {}
  try { vite.kill(); } catch {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
