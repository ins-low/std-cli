const fs = require('fs-extra')
const loadPresetFromDir = require('./loadPresetFromDir')
const log = require('./cli-share/logger').log;

module.exports = async function loadRemotePreset (repository, clone) {
  const os = require('os')
  const path = require('path')
  const download = require('download-git-repo')

  const presetName = repository
    .replace(/((?:.git)?#.*)/g, '')
    .split('/')
    .slice(-1)[0]
    .replace(/[:#]/g, '')
  //當前系統的臨時文件夾
  const tmpdir = path.join(os.tmpdir(), 'preset', presetName.replace(/.git/,''))
  
 
  // clone will fail if tmpdir already exists
  // https://github.com/flipxfx/download-git-repo/issues/41
  if (clone) {
    await fs.remove(tmpdir)
  }

  await new Promise((resolve, reject) => {
    log('***************** 開始拉取遠程文件 *****************','拉取文件')
    //拉取遠程文件到當前系統的臨時文件夾中
    download(repository, tmpdir, { clone }, err => {
      if (err) {
        console.log(err);
        return reject(err)
      }
      log('***************** 拉取遠程文件成功 *****************','拉取文件')
      resolve()
    })
  })
  //處理複製文件操作
  return await loadPresetFromDir(tmpdir)
}
