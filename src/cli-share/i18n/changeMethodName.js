const types = require("@babel/types");
const t = types;
module.exports = function (path) {
  console.log('********************************************');
  console.log('CallExpression', path.node.callee.name);
  if (path.node.callee && path.node.callee.name === 'myCustomerEvent') {
    path.skip()
  };
  if (path.node.callee && path.node.callee.name === '$t') {
    let newFunc = t.callExpression(t.Identifier('myCustomerEvent'), path.node.arguments);
    path.replaceWith(newFunc);
  }
}