/**
 * @description
 * 可以把excel中的i18n信息導出為json文件
 */
const { log } = require("../../cli-share/logger");
const fs = require("fs-extra");
const path = require("path");
const excelConfig = require("./export.local.js");
async function excel2i18n(configUrl, option, configs) {
  if (configs.init) {
    log(__dirname,'DIRName')
    const src = path.resolve(__dirname, "./template");
    const to = path.join("./", "i18n");
    log('init.src', src);
    log('init.to', to);
    await fs.copy(src, to);
  }
  if (configs.trans) {
    outputUrl = configUrl || '';
    excelConfig(outputUrl);
  }
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  console.log(args);
  return excel2i18n(configUrl, option, configs);
};
