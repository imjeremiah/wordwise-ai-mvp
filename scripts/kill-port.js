#!/usr/bin/env node

/**
 * Kill any process running on the specified port
 * This ensures a clean start for the development server
 */

const { exec } = require('child_process');
const port = process.argv[2] || '3005';

console.log(`[Port Killer] Checking for processes on port ${port}...`);

// Function to kill port on different platforms
function killPort(port) {
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    // Windows command
    command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    
    exec(command, (error, stdout) => {
      if (stdout) {
        const lines = stdout.trim().split('\n');
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          
          console.log(`[Port Killer] Found process ${pid} on port ${port}, killing it...`);
          exec(`taskkill /PID ${pid} /F`, (killError) => {
            if (killError) {
              console.error(`[Port Killer] Failed to kill process ${pid}:`, killError.message);
            } else {
              console.log(`[Port Killer] Successfully killed process ${pid}`);
            }
          });
        });
      } else {
        console.log(`[Port Killer] No process found on port ${port}`);
      }
    });
  } else {
    // Unix/Linux/Mac command
    command = `lsof -ti:${port}`;
    
    exec(command, (error, stdout) => {
      if (stdout) {
        const pids = stdout.trim().split('\n');
        pids.forEach(pid => {
          console.log(`[Port Killer] Found process ${pid} on port ${port}, killing it...`);
          exec(`kill -9 ${pid}`, (killError) => {
            if (killError) {
              console.error(`[Port Killer] Failed to kill process ${pid}:`, killError.message);
            } else {
              console.log(`[Port Killer] Successfully killed process ${pid}`);
            }
          });
        });
      } else {
        console.log(`[Port Killer] No process found on port ${port}`);
      }
    });
  }
}

// Kill the port
killPort(port);

// Give it a moment to complete
setTimeout(() => {
  console.log(`[Port Killer] Port ${port} should now be free`);
  process.exit(0);
}, 1000); 