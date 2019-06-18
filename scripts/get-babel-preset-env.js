const crypto = require('crypto');
const path = require('path');
const { execSync } = require('child_process');

const rootFolder = path.join(__dirname, '..');
const babelFolder = path.join(rootFolder, './src/babel');
const cacheFolder = path.join(
  require('os').homedir(),
  '.cache/',
  crypto.randomBytes(5).toString('hex')
);
const babelPresetDataFolder = path.join(cacheFolder, './babel/packages/babel-preset-env/data');
const babelPresetSrcFolder = path.join(cacheFolder, './babel/packages/babel-preset-env/src');

exec(`mkdir -p ${cacheFolder}`);

exec('git clone --depth 1 https://github.com/babel/babel.git', {
  cwd: cacheFolder,
});

exec(`mkdir -p ${babelFolder}`);
exec(`cp -r ${babelPresetDataFolder} ${babelFolder}/data`);
exec(`cp -r ${babelPresetSrcFolder} ${babelFolder}/src`);

function exec(cmd, opts = {}) {
  console.log(cmd);
  return execSync(cmd, { encoding: 'utf-8', ...opts });
}
