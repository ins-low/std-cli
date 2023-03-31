const path = require('path')
const fs = require('fs-extra')
const log = require('./cli-share/logger.js').log;

module.exports = async function loadPresetFromDir(dir) {
 
  const presetPath = path.join(dir, './src');
  const currentPath = path.resolve('./src/bw-libs');
  const packageDir = path.join(dir, 'package.json');
  if (!fs.existsSync(presetPath)) {
    throw new Error('local preset does not contain src floder')
  }

  if (!fs.existsSync(packageDir)) {
    throw new Error('not found package.json file');
  }

  let packageJson = await fs.readJSON(packageDir);
  log('拉取得版本號/項目名：'+packageJson.version,packageJson.name);

  log('***************** 開始複製文件 *****************','複製文件')
  //複製src中的所有文件到當前目錄中的src目錄
  fs.copy(presetPath, currentPath).then(res => { 
    log('***************** 複製文件成功 *****************','複製文件')
  }).catch(err => {
    log('***************** 複製文件失敗，請重試 *****************','ERROR')
  });

  
}
