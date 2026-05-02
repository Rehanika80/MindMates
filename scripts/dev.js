const { spawn } = require('child_process')

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const backend = spawn(npmCommand, ['run', 'dev', '--workspace', 'backend'], {
  stdio: 'inherit',
  shell: true,
})

const frontend = spawn(npmCommand, ['run', 'dev', '--workspace', 'frontend'], {
  stdio: 'inherit',
  shell: true,
})

const shutdown = () => {
  backend.kill()
  frontend.kill()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)