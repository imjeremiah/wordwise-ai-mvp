const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define log file path
const logFilePath = path.join(__dirname, '..', 'docs', 'log.txt');

// Clear the log file
console.log('[Logger] Clearing log file...');
fs.writeFileSync(logFilePath, '', 'utf8');
console.log('[Logger] Log file cleared. Starting dev server with logging...\n');

// Run the original dev command
const devProcess = spawn('node', ['scripts/kill-port.js', '3005'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Function to write to both console and file
function logOutput(data, isError = false) {
  const text = data.toString();
  
  // Write to console
  if (isError) {
    process.stderr.write(text);
  } else {
    process.stdout.write(text);
  }
  
  // Append to log file
  fs.appendFileSync(logFilePath, text);
}

// Capture stdout
devProcess.stdout.on('data', (data) => {
  logOutput(data);
});

// Capture stderr
devProcess.stderr.on('data', (data) => {
  logOutput(data, true);
});

// Handle process completion
devProcess.on('close', (code) => {
  console.log(`\n[Logger] Dev process exited with code ${code}`);
  fs.appendFileSync(logFilePath, `\n[Logger] Dev process exited with code ${code}\n`);
});

// After kill-port completes, run next dev
devProcess.on('exit', () => {
  console.log('[Logger] Starting Next.js dev server...\n');
  fs.appendFileSync(logFilePath, '[Logger] Starting Next.js dev server...\n\n');
  
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '3005'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  // Capture Next.js stdout
  nextProcess.stdout.on('data', (data) => {
    logOutput(data);
  });

  // Capture Next.js stderr
  nextProcess.stderr.on('data', (data) => {
    logOutput(data, true);
  });

  // Handle Next.js process termination
  nextProcess.on('close', (code) => {
    console.log(`\n[Logger] Next.js dev server exited with code ${code}`);
    fs.appendFileSync(logFilePath, `\n[Logger] Next.js dev server exited with code ${code}\n`);
    process.exit(code);
  });

  // Forward signals to child process
  process.on('SIGINT', () => {
    console.log('\n[Logger] Received SIGINT, shutting down...');
    fs.appendFileSync(logFilePath, '\n[Logger] Received SIGINT, shutting down...\n');
    nextProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n[Logger] Received SIGTERM, shutting down...');
    fs.appendFileSync(logFilePath, '\n[Logger] Received SIGTERM, shutting down...\n');
    nextProcess.kill('SIGTERM');
  });
});

// Log that everything is set up
console.log(`[Logger] All output will be logged to: ${logFilePath}`);
fs.appendFileSync(logFilePath, `[Logger] Logging started at ${new Date().toISOString()}\n`);
fs.appendFileSync(logFilePath, `[Logger] All output will be logged to: ${logFilePath}\n\n`); 