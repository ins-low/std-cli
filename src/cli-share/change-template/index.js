const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const parser = require("@babel/parser");
const fs = require("fs-extra");
const path = require("path");
const { log } = require("../logger");
const vueComplier = require("@vue/compiler-sfc");
// console.log(vueComplier)
const t = types;

async function trans(configUrl, option, configs) {
  let [source, target] = configs._;
  let fileUrl = path.resolve(__dirname, source);
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let script = await fs.readFile(fileUrl, { encoding: "utf-8" });

  //解析script
  let script_ast = parser.parse(script, {
    sourceType: "module",
  });
  function findParentPathKeyName(path, name) {
    let res = null;
    let _path = path;
    while (_path) {
      if (_path.node && _path.node.key && _path.node.key.name === name) {
        res = _path;
        break;
      }
      _path = _path.parentPath;
    }
    return res;
  }
  traverse(script_ast, {
    ObjectMethod(path) {
      // const { node } = path;
      // if (node.key.name === 'testGo') {
      //   if (path.node.body.body) {
      //     path.node.body.body.forEach(item => {
      //       console.log('node:', item);
      //       if (item.type === 'ExpressionStatement'
      //        &&  item.expression.callee.property.name === '$t'
      //       ) {
      //         // console.log('node:', item);
      //         item.expression.callee.property.name = 'TestMethod';
      //       }
      //     })
      //   }
      //   // console.log('node:',path.node.body.body);
      // }
    },
    MemberExpression(path) {
      const { node } = path;
      if (node && node.property.name === "$t") {
        console.log("start ****node");
        let finded = findParentPathKeyName(path, "testGo");

        if (finded) {
          console.log("****node", finded);
          node.property.name = "TestMethod";
        }
        // node.property.name = 'TestMethod';
      }
    },
  });
  let script_code = generate(script_ast).code;

  let outputFile = path.resolve(__dirname, target);
  // console.log(script_str);
  let outputData = script_code;
  await fs.writeFile(outputFile, outputData, { encoding: "utf-8" });
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  console.log(args);
  return trans(configUrl, option, configs);
};
