const types = require("@babel/types");
const t = types;
exports.default = function class2object(path) {
  const declaration = path.get("declaration");
  const isClassDeclaration = declaration.isClassDeclaration();

  const scope = declaration.isScope()
      ? declaration.scope.parent
      : declaration.scope;
  id = scope.generateUidIdentifier("default");

  let bodys = scope.block.body.body;
  let res = [];
  bodys.forEach((body, index) => {
    if (body.type == 'ClassMethod') {
      let method = t.objectMethod('method',t.Identifier(body.key.name),body.params,body.body);
      res.push(method);
    } else if (body.type == 'ClassProperty') {
      if (body.value ) {
        let obj = t.objectProperty(t.Identifier(body.key.name),body.value);
        res.push(obj);
      }
    }
  });
  
  const objExp = t.ObjectExpression(res);
  // console.log('objExp', objExp);
  // const updatedDeclaration = 
  // t.variableDeclaration("const", [
  //    t.variableDeclarator(t.cloneNode(scope.block.id), objExp.node),
  //  ]);
  path.replaceWith(objExp);
}