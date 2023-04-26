const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const parser = require("@babel/parser");
const fs = require("fs-extra");
const path = require("path");
const { log } = require("../logger");
const vueComplier = require("@vue/compiler-sfc");
console.log(vueComplier)
const t = types;

async function trans(configUrl, option, configs) {
  let fileUrl = path.resolve(__dirname, "./test.vue");
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let file = await fs.readFile(fileUrl, { encoding: "utf-8" });
  let fileInfo = select(file);
  console.log('fileInfo', fileInfo);
  let template_ast = parser.parse(fileInfo.template, {
    // sourceType: "unambiguous",
    plugins:["jsx", "flow", "typescript"]
  });
  console.log("template_ast", template_ast);

 
  // let res = vueComplier.compile(fileInfo.template, {
  //   modules: {
  //     preTransformNode: (el) => { 
  //       console.log('preTransformNode', el);
  //     },
  //     transformNode: (el) => { 
  //       console.log('transformNode', el);
  //     },
  //     postTransformNode: (el) => { 
  //       console.log('postTransformNode', el);
  //     },
  //     genData: (el) => { 
  //       console.log('genData', el);
  //     },
  //     transformCode: (el, code) => { 
  //       console.log('transformCode', el,code);
  //     },
  //     staticKeys:[]
  //   }
  // });
  // traverse(template_ast);
  // console.log('vueComplier.compile', res.ast.children);
  let str = vueComplier.generateCodeFrame(fileInfo.template);
  console.log('generateCodeFrame', str);
  let outputData = `<template>${str}</template>
                  `;
  let time = new Date() * 1;

  let outputFile = path.resolve(__dirname, "output" + time + ".vue");
  // console.log(script_str);
  // await fs.writeFile(outputFile,outputData,{encoding:'utf-8'})
}

function select(source) {
  const loaderContext = this;
  const output = vueComplier.parse(source, { pad: "line" }).descriptor;
  console.log('output', output);
  let script_str = ``;
  let style_str = ``;
  let template_str = ``;
  let style_arr = [];
  if (output.template) {
    template_str = output.template.content;
  }
  
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
