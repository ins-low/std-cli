const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const parser = require('@babel/parser');
const fs = require('fs-extra');
const path = require('path');

// console.log(traverse);
// console.log(generator);
// console.log(parser);
// console.log(types);
// console.log(parser);

async function trans(configUrl, option, configs) { 
  let fileUrl = path.resolve(__dirname, './test.js');
  if (!fs.existsSync(fileUrl)) {
    throw new Error('file not Found');
  }

  let file = await fs.readFile(fileUrl,{encoding:'utf-8'});
  
  // console.log(file);
  // console.log(traverse);
  let ast = parser.parse(file, {
    sourceType:'module'
  });
  ast.program.body[0].declaration.type = 'ClassDeclaration';
  console.log(ast.program.body[0]);
  traverse(ast, {
    enter(path) {
      const { node } = path;
      const expressionFields = node.type
      if (expressionFields) {
        console.log(expressionFields)
        // (typeof expressionFields === 'function'
        //   ? expressionFields(node)
        //   : expressionFields
        // ).forEach((fieldName) => {
        //   const fieldValue = node[fieldName];
        //   if (typeof fieldValue === 'object') {
        //     if (Array.isArray(fieldValue)) {
        //       // fieldValue.forEach((item) => {
                
        //       // });
        //     } else {
              
        //     }
        //   }
        // });
      }
    },
  });

  console.log(generate(ast));
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  // console.log(args);
  return trans(configUrl, option, configs);
};