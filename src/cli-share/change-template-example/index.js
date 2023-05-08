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
  
  // console.log("script_ast", script_ast);
  //解析template
  let { compileTemplate } = vueComplier;
  const compiled = compileTemplate({
    source:fileInfo.template,
    filename: fileUrl,
    id: "1111111",
  });
  let template_str = compiled.code;
  let template_ast = parser.parse(template_str, {
    sourceType: "module",
  });
  let tempalte_render = null;
  traverse(template_ast, {
    ExportDeclaration(path) { 
      // console.log('ExportDeclaration')
      const { node } = path;
      tempalte_render = node;
    },
    MemberExpression(path) { 
      const { node } = path;
      if (node && node.property.name === '$t') {
        // console.log(node);
        node.property.name = 'TestMethod';
      }
      
    },
    ThisExpression(path) {
    },
  });
  let template_code = generate(template_ast).code;


   //解析script
   let script_ast = parser.parse(fileInfo.script, {
    sourceType: "module",
  });
  traverse(script_ast, {
    ExportDefaultDeclaration(path) { 
      let obj = path.node.declaration;
      console.log(obj);
      if (tempalte_render) {
        const exportFunc = tempalte_render.declaration;
        console.log('tempalte_render.key.name', tempalte_render.declaration);
        let renderFunc = t.objectMethod('method', t.Identifier(exportFunc.id.name), exportFunc.params, exportFunc.body);
        obj.properties.push(renderFunc);
      }
    },
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
  let outputData = template_code + '\n' + script_code; 
  await fs.writeFile(outputFile,outputData,{encoding:'utf-8'})
}
/**
 * 編譯vue文件，分類 template,script,style 為字符串；
 * @param {string} source 
 * @returns 
 */
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
