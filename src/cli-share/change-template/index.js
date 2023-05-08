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
  let fileUrl = path.resolve(__dirname, "./test.js");
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let source = await fs.readFile(fileUrl, { encoding: "utf-8" });
  
   //解析script
   let script_ast = parser.parse(source, {
    sourceType: "module",
  });
  traverse(script_ast, {
    
    MemberExpression(path) {
      const { node } = path;
      if (node && node.property.name === '$t') {
        // console.log(node);
        node.property.name = 'TestMethod';
      }
      
    },
  });
  let script_code = generate(script_ast).code;
  let time = new Date() * 1;

  let outputFile = path.resolve(__dirname, "output" + time + ".js");
  // console.log(script_str);
  let outputData = script_code; 
  await fs.writeFile(outputFile,outputData,{encoding:'utf-8'})
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  // console.log(args);
  return trans(configUrl, option, configs);
};
