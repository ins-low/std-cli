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
  let fileUrl = path.resolve(__dirname, "./test.vue");
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let source = await fs.readFile(fileUrl, { encoding: "utf-8" });
  let fileInfo = select(source);
  // console.log('fileInfo', fileInfo);
  let script_ast = parser.parse(fileInfo.script, {
    sourceType: "module",
  });
  // console.log("script_ast", script_ast);

  let { compileTemplate } = vueComplier;
  const compiled = compileTemplate({
    source:fileInfo.template,
    filename: fileUrl,
    id: "1111111",
  });

  // console.log(compiled);
  // console.log(compiled.errors);
  console.log(compiled.code);
  // console.log(compiled);

  // console.log(generate(compiled.ast).code);
  console.log('\n');
  console.log('sciprt_ast',script_ast);
  let res = traverse(script_ast, {
    program(path) {
      console.log('program', path);
    },
  });

  let script_code = generate(script_ast).code;
  // console.log(script_code);
  // traverse(template_ast);
  // console.log('vueComplier.compile', res.ast.children);
  // let str = generate(template_ast).code;
  // console.log('generateCodeFrame', str);
  // let outputData = `<template>${str}</template>`;
  let time = new Date() * 1;

  let outputFile = path.resolve(__dirname, "output" + time + ".js");
  // console.log(script_str);
  let outputData = compiled.code + '\n' + script_code; 
  await fs.writeFile(outputFile,outputData,{encoding:'utf-8'})
}

function select(source) {
  const loaderContext = this;
  const output = vueComplier.parse(source, { pad: "line" }).descriptor;
  // console.log('output', output);
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
