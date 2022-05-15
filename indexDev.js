const { spawn } = require('child_process');

const child = spawn('webpack', ['--watch', '--mode=development'], {shell: true});
var c = false;
child.stdout.on('data', (chunk) => {
  console.log(chunk.toString());
  if(!c) {
    require('./src/server/server.js')();
    c = true;
  }
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});