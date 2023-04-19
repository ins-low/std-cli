const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const types = require("@babel/types");
const parser = require("@babel/parser");
const nameFunction = require("@babel/helper-function-name").default;
const fs = require("fs-extra");
const path = require("path");
const { log } = require("../cli-share/logger");
const splitExportDeclaration = require("./export-split").default;
const t = types;
// console.log(traverse);
// console.log(generator);
// console.log(parser);
// console.log(types);
// console.log(parser);



const MAYBE_EXPRESSIONS = {
  ArrayExpression: { fields: ["elements"] },
  AssignmentExpression: { fields: ["left", "right"] },
  BinaryExpression: { fields: ["left", "right"] },
  CallExpression: { fields: ["arguments", "callee"] },
  ConditionalExpression: { fields: ["test", "consequent", "alternate"] },
  DoWhileStatement: { fields: ["test"] },
  ExpressionStatement: { fields: ["expression"] },
  ForInStatement: { fields: ["right"] },
  ForStatement: { fields: ["init", "test", "update"] },
  IfStatement: { fields: ["test"] },
  LogicalExpression: { fields: ["left", "right"] },
  MemberExpression: {
    fields: (node) => {
      return node.type === "MemberExpression" && node.computed
        ? ["object", "property"]
        : ["object"];
    },
  },
  NewExpression: { fields: ["callee", "arguments"] },
  ObjectMethod: {
    fields: (node) => {
      return node.type === "ObjectMethod" && node.computed ? ["key"] : [];
    },
  },
  ObjectProperty: {
    fields: (node) => {
      return node.type === "ObjectProperty" && node.computed
        ? ["key", "value"]
        : ["value"];
    },
  },
  ReturnStatement: { fields: ["argument"] },
  SequenceExpression: { fields: ["expressions"] },
  ParenthesizedExpression: { fields: ["expression"] },
  SwitchCase: { fields: ["test"] },
  SwitchStatement: { fields: ["discriminant"] },
  ThrowStatement: { fields: ["argument"] },
  UnaryExpression: { fields: ["argument"] },
  UpdateExpression: { fields: ["argument"] },
  VariableDeclarator: { fields: ["init"] },
  WhileStatement: { fields: ["test"] },
  WithStatement: { fields: ["object"] },
  AssignmentPattern: { fields: ["right"] },
  ArrowFunctionExpression: { fields: ["body"] },
  ClassExpression: { fields: ["superClass"] },
  ClassDeclaration: { fields: ["superClass"] },
  ExportDefaultDeclaration: { fields: ["declaration"] },
  ForOfStatement: { fields: ["right"] },
  ClassMethod: {
    fields: (node) => {
      return node.type === "ClassMethod" && node.computed ? ["key"] : [];
    },
  },
  SpreadElement: { fields: ["argument"] },
  TaggedTemplateExpression: { fields: ["tag"] },
  TemplateLiteral: { fields: ["expressions"] },
  YieldExpression: { fields: ["argument"] },
  AwaitExpression: { fields: ["argument"] },
  OptionalMemberExpression: {
    fields: (node) => {
      return node.type === "OptionalMemberExpression" && node.computed
        ? ["object", "property"]
        : ["object"];
    },
  },
  OptionalCallExpression: { fields: ["callee", "arguments"] },
  JSXSpreadAttribute: { fields: ["argument"] },
  BindExpression: { fields: ["object", "callee"] },
  ClassProperty: {
    fields: (node) => {
      return node.type === "ClassProperty" && node.computed
        ? ["key", "value"]
        : ["value"];
    },
  },
  PipelineTopicExpression: { fields: ["expression"] },
  PipelineBareFunction: { fields: ["callee"] },
  ClassPrivateProperty: { fields: ["value"] },
  Decorator: { fields: ["expression"] },
  TupleExpression: { fields: ["elements"] },
  TSDeclareMethod: {
    fields: (node) => {
      return node.type === "TSDeclareMethod" && node.computed ? ["key"] : [];
    },
  },
  TSPropertySignature: {
    fields: (node) => {
      return node.type === "TSPropertySignature" && node.computed
        ? ["key", "initializer"]
        : ["initializer"];
    },
  },

  TSMethodSignature: {
    fields: (node) => {
      return node.type === "TSMethodSignature" && node.computed ? ["key"] : [];
    },
  },
  TSAsExpression: { fields: ["expression"] },
  TSTypeAssertion: { fields: ["expression"] },
  TSEnumDeclaration: { fields: ["initializer"] },
  TSEnumMember: { fields: ["initializer"] },
  TSNonNullExpression: { fields: ["expression"] },
  TSExportAssignment: { fields: ["expression"] },
};
let keywordVars = new Set();
async function trans(configUrl, option, configs) {
  let fileUrl = path.resolve(__dirname, "./test.js");
  if (!fs.existsSync(fileUrl)) {
    throw new Error("file not Found");
  }

  let file = await fs.readFile(fileUrl, { encoding: "utf-8" });

  // console.log(file);
  // console.log(traverse);
  let ast = parser.parse(file, {
    sourceType: "module",
  });

  const addIdentifierIfNeeded = (x) => {
    if (typeof x === "object" && x && x.name) {
      keywordVars.add(x.name);
    }
  };
  const contextName = "__$$context";

  function letDeclaration(ref,node){
    t.variableDeclaration("let", [
      t.variableDeclarator(ref, t.toExpression(node)),
    ]);
  }

  function class2object(path){
    const {node} = path;
    t.ObjectProperty(t.variableDeclarator(node.id,t.toExpression (node)) )
  }

  traverse(ast, {

    ExportDefaultDeclaration(path) {
      splitExportDeclaration(path);
    },
    ClassExpression(path) {
      // const { node } = path;

      // const ref = node.id || path.scope.generateUidIdentifier("class");
      // console.log(node.id);
      // console.log(t.identifier(node.id.name));
      // // console.log(path);
      // let methods = t.FunctionDeclaration(t.identifier(node.id.name));
      // console.log(methods);
      // const inferred = nameFunction(path);
      // console.log(inferred)
      // if (inferred && inferred !== node) {
      //   path.replaceWith(inferred);
      //   return;
      // }
    },
    ClassDeclaration(path) {
        const { node } = path;

        const ref = node.id || path.scope.generateUidIdentifier("class");
        // if(node.id){
        //   console.log(node.id);
        //   let func = t.identifier(node.id.name);
        //   console.log(func);
        //   let methods = t.FunctionDeclaration(ref,[func]);
        //   console.log(methods);
        // }
        path.replaceWith(
          class2object(path)
        );
      },
    ThisExpression(path) {
      // console.log(path)
      // path.replaceWith(types.identifier(contextName));
    },
  });

  log(generate(ast).code);
}

module.exports = (...args) => {
  const [configUrl, option, configs] = args;
  // console.log(args);
  return trans(configUrl, option, configs);
};
