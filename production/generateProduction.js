import { spawn } from 'child_process';
/*import { join } from 'path';
import { copyFileSync, readdirSync, lstatSync, mkdirSync } from 'fs';
import  assets from './assets.json';
import shell from 'shelljs';

function tree(dir, arr) {
  var Dir = readdirSync(dir);
  Dir.forEach((x, i) => {
    if(lstatSync(join(dir, x)).isDirectory()) {
      tree(x, arr);
    }else {
      arr.push(x);
    }
    if(i - 1 === dir.length) return arr;
  });
}
async function copyAssets() {
  return new Promise(function (resolve, reject) {
    assets.forEach(x => {
      if(x.endsWith('*')) {
        var arr = [];
        var p1 = x.split('/').slice(0, x.split('/').length - 1);
        tree(join(__dirname, '..', p1.join('/')), arr);
        arr.forEach((y, i) => {
          console.log(join(__dirname, '..', x.split('/').slice(0, x.split('/').length - 1).join('/') + "/" + y));
          console.log(join(__dirname, x.split('/').slice(1, x.split('/').length - 1).join('/') + "/" + y));
          var p2 = join(__dirname, x.split('/').slice(1, x.split('/').length - 1).join('/') + "/" + y).replace('/src/', '/production/');
          shell.mkdir(p2.split('/').slice(0, p2.split('/').length - 2).join('/'));
          copyFileSync(join(__dirname, '..', p1.join('/') + "/" + y), p2);
        });
      }else {
        //console.log(join(__dirname, '..', x));
        var p1 = join(__dirname, '..', x.replace('/src/', '/production/'));
        shell.mkdir('-p', p1.split('/').slice(0, x.replace('/src/', '/production/').split('/').length - 2).join('/'));
        copyFileSync(join(__dirname, '..', x), p1);
      }
    });
  });
}*/
async function generateDist() {
  return new Promise(function(resolve, reject) {

    const child = spawn('webpack build --config webpack.prod.js --mode=production', {shell: true, execArgv: ['--inspect']});
    var c = false;
    child.stdout.on('data', (chunk) => {
      console.log(chunk.toString());
      if(chunk.toString().includes('compiled with')) {
        resolve();
      }
    });
    
    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}
async function letsGetItDone() {
  await generateDist();
}
letsGetItDone();