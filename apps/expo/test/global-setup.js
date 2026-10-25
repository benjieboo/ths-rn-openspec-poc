// Starts the real mock API (latency off) once for the whole run; tests talk to it over HTTP.
const { spawn } = require('node:child_process');
const path = require('node:path');

const PORT = 4099;

module.exports = async () => {
  const cwd = path.resolve(__dirname, '../../../packages/mock-api');
  const child = spawn('npx', ['tsx', 'src/server.ts'], {
    cwd,
    env: { ...process.env, PORT: String(PORT), MOCK_LATENCY: 'off' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  globalThis.__MOCK_API__ = child;
  process.env.TEST_API_URL = `http://127.0.0.1:${PORT}`;

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('mock API did not start')), 20000);
    child.stdout.on('data', (d) => {
      if (String(d).includes('listening')) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.stderr.on('data', (d) => process.stderr.write(d));
    child.on('exit', (code) => reject(new Error(`mock API exited with ${code}`)));
  });
};
