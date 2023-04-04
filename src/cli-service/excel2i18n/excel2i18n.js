/**
 * @description
 * 可以把excel中的i18n信息導出為json文件
 */
const { log } = require("../../cli-share/logger");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const execa = require('execa');

async function excel2i18n(configUrl, option, configs) {
  if (configs.init) {
    const src = path.resolve(__dirname, "./template");
    const to = path.join("./", "i18n");
    log('init',src, to);
    await fs.copy(src, to);
  }
  if (configs.trans) {
    const excelUrl = path.join("./i18n/i18n.xlsx");
    const excelConfig = path.join("./i18n/export.local.js");
    log('trans',excelUrl);
    log('trans',excelConfig);
    if (!fs.existsSync(excelConfig)) {
      throw new Error('file not found: ' + excelConfig);
    }
    try {
      const cmd = await execa('node');
      cmd.command(excelConfig);
      log('cmd', cmd);
    } catch (e) {
      log('Error', e);
    }
    
  }
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  return excel2i18n(configUrl, option, configs);
};
