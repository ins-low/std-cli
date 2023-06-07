const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const parser = require("@babel/parser");
const nameFunction = require("@babel/helper-function-name").default;
const fs = require("fs-extra");
const path = require("path");
const hash = require("hash-sum");
const qs = require("querystring");
const { log } = require("../logger");
const splitExportDeclaration = require("../../cli-trans/export-split").default;
const loaderUtils = require("loader-utils");
let errorEmitted = false;

const t = types;

async function trans(configUrl, option, configs) {
  let rootDir = './';
  let _dir = path.resolve(__dirname, rootDir);
  console.log(_dir);
  let res = await fs.readdir(_dir);
  deepRead(res,rootDir);
  console.log(res);
}

async function deepRead(dirList,parentDir) {
  dirList.forEach(async file => {
    let dir = path.relative(parentDir,file);
    console.log('dir::::::::', dir);
    let isDir = await fs.readFile(dir,async (a, b, c) => {
      if (!b) {
        let res = await fs.readdir(dir);
        deepRead(res,dir);
      }
      console.log('isDir:::::::::',a,b,c);
    });
    
    // let res = await fs.readdir(path.join(rootDir));
  })
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  // console.log(args);
  return trans(configUrl, option, configs);
};
