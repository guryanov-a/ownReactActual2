import { spawn } from 'child_process';

async function run() {
  const vitestPath = './node_modules/vitest/vitest.mjs';

  let args = process.argv.slice(2);

  // Find the index of the "--threads" argument
  const threadsIndex = args.findIndex(arg => arg === '--threads');

  // If found, remove "--threads" and the following argument
  if (threadsIndex !== -1) {
    args.splice(threadsIndex, 2);
  }

  // Run the actual vitest command with the modified arguments
  const vitest = spawn('node', [vitestPath, ...args], { stdio: 'inherit' });

  vitest.on('exit', process.exit);
}

run();
