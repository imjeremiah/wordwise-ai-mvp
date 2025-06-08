# Development Logging

## Overview
The development server now automatically logs all terminal output to `docs/log.txt`. This ensures you can see the complete output history without being limited by terminal scrollback.

## How It Works

1. **Automatic Clearing**: Each time you run `npm run dev`, the log file is automatically cleared
2. **Real-time Logging**: All output (stdout and stderr) is written to both the terminal and the log file in real-time
3. **Complete History**: The entire session's output is preserved in the file

## Usage

### Normal Development (with logging)
```bash
npm run dev
```
This runs the dev server with automatic logging to `docs/log.txt`.

### Development without logging
```bash
npm run dev:no-log
```
This runs the dev server without logging (original behavior).

### Viewing Logs
You can view the logs in real-time using:
```bash
tail -f docs/log.txt
```

Or open the file in your editor to see the complete output history.

## Log Location
- **File**: `docs/log.txt`
- **Note**: This file is git-ignored to prevent committing logs to the repository

## Implementation Details
- The logging is handled by `scripts/dev-with-logging.js`
- It spawns the port killer and Next.js dev server as child processes
- All output is captured and written to both console and file
- Proper signal handling ensures clean shutdown 