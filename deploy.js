import FtpDeploy from 'ftp-deploy';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let ftpDeploy = new FtpDeploy();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let myArgs = process.argv.slice(2);

let deployConfig = {
  host: myArgs[0],
  user: myArgs[1],
  password: myArgs[2],
  port: 21,
  localRoot: __dirname + '/build/',
  remoteRoot: '/',
  include: ['**/*'],
  exclude: [],
  deleteRemote: true,
  forcePasv: true
};

// use with promises
ftpDeploy.deploy(deployConfig)
.then(res => console.log('finished:', res))
.catch(err => console.log(err));
