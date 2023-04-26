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
const vueComplier = require("vue-template-compiler");
const loaderUtils = require("loader-utils");
const selectBlock = require("./select");
let errorEmitted = false;

const t = types;

async function trans(configUrl, option, configs) {
  let fileUrl = path.resolve(__dirname, "./test.vue");
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let file = await fs.readFile(fileUrl, { encoding: "utf-8" });
  // console.log('file', file);
  let fileInfo = select(file);

  let template_ast = vueComplier.parseComponent(fileInfo.template, {
    sourceType: "module",
  });
  console.log("template_ast", template_ast);

  let ast = parser.parse(fileInfo.script, {
    sourceType: "module",
  });
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      splitExportDeclaration(path);
    },
    Function(path) {
      // console.log('function', path.node.body.body);
      if (
        path.node.body.body &&
        path.node.body.body[0] &&
        path.node.body.body[0]
      ) {
        try {
          // console.log('function', path.node.body.body[1]);
        } catch (e) {
          // console.log('error', e);
        }
      }
    },
    CallExpression(path) {
      console.log("********************************************");
      console.log("CallExpression", path.node.callee.name);
      if (path.node.callee && path.node.callee.name === "myCustomerEvent") {
        path.skip();
      }
      if (path.node.callee && path.node.callee.name === "$t") {
        let newFunc = t.callExpression(
          t.Identifier("myCustomerEvent"),
          path.node.arguments
        );
        path.replaceWith(newFunc);
      }
    },
    MemberExpression(path) {
      // console.log('********************************************');
      // console.log('MemberExpression', path.node);
    },
  });

  let script_str = generate(template_ast, { encoding: "utf-8" }).code;
  let outputData = `<template>${fileInfo.template}</template>
  
                  <script>${script_str}</script>
                  
                  <style>${fileInfo.style}</style>
                  `;
  let time = new Date() * 1;

  let outputFile = path.resolve(__dirname, "output" + time + ".vue");
  console.log(script_str);
  // await fs.writeFile(outputFile,outputData,{encoding:'utf-8'})
}

function select(source) {
  const loaderContext = this;
  const output = vueComplier.parseComponent(source, { pad: "line" });
  // console.log('output', output.script.content);
  let script_str = ``;
  let style_str = ``;
  let style_arr = [];
  let template_str = output.template.content;
  if (output.script && !output.script.src) {
    script_str = output.script.content;
  }
  if (output.styles) {
    output.styles.forEach((style) => {
      if (!style.src) {
        style_arr.push(style.content);
      }
    });
    style_str = style_arr.join("\n");
    // console.log('style_arr',style_arr);
  }
  return {
    script: script_str,
    template: template_str,
    style: style_str,
  };
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  // console.log(args);
  return trans(configUrl, option, configs);
};
