const types = require('@babel/types');
const t = types;
module.exports = function core(defaultLibraryName) {
  return function (_ref) {
    function buildExpressionHandler(node, props, path, state) {
      console.log('props', props);
      var file = path && path.hub && path.hub.file || state && state.file;
      props.forEach(function (prop) {
        if (!types.isIdentifier(node[prop])) return;

        if (specified[node[prop].name]) {
          node[prop] = importMethod(node[prop].name, file, state.opts); // eslint-disable-line
        }
      });
    }
    function importMethod(methodName, file, opts) {
      if (!selectedMethods[methodName]) {
        var options;
        var path;

        if (Array.isArray(opts)) {
          options = opts.find(function (option) {
            return moduleArr[methodName] === option.libraryName || libraryObjs[methodName] === option.libraryName;
          }); // eslint-disable-line
        }

        options = options || opts;
        var _options = options,
            _options$libDir = _options.libDir,
            libDir = _options$libDir === void 0 ? 'lib' : _options$libDir,
            _options$libraryName = _options.libraryName,
            libraryName = _options$libraryName === void 0 ? defaultLibraryName : _options$libraryName,
            _options$style = _options.style,
            style = _options$style === void 0 ? true : _options$style,
            styleLibrary = _options.styleLibrary,
            _options$root = _options.root,
            root = _options$root === void 0 ? '' : _options$root,
            _options$camel2Dash = _options.camel2Dash,
            camel2Dash = _options$camel2Dash === void 0 ? true : _options$camel2Dash;
        var styleLibraryName = options.styleLibraryName;
        var _root = root;
        var isBaseStyle = true;
        var modulePathTpl;
        var styleRoot;
        var mixin = false;
        var ext = options.ext || '.css';

        if (root) {
          _root = "/".concat(root);
        }

        if (libraryObjs[methodName]) {
          path = "".concat(libraryName, "/").concat(libDir).concat(_root);

          if (!_root) {
            importAll[path] = true;
          }
        } else {
          path = "".concat(libraryName, "/").concat(libDir, "/").concat(parseName(methodName, camel2Dash));
        }

        var _path = path;
        selectedMethods[methodName] = addDefault(file.path, path, {
          nameHint: methodName
        });

        if (styleLibrary && _typeof(styleLibrary) === 'object') {
          styleLibraryName = styleLibrary.name;
          isBaseStyle = styleLibrary.base;
          modulePathTpl = styleLibrary.path;
          mixin = styleLibrary.mixin;
          styleRoot = styleLibrary.root;
        }

        if (styleLibraryName) {
          if (!cachePath[libraryName]) {
            var themeName = styleLibraryName.replace(/^~/, '');
            cachePath[libraryName] = styleLibraryName.indexOf('~') === 0 ? resolve(process.cwd(), themeName) : "".concat(libraryName, "/").concat(libDir, "/").concat(themeName);
          }

          if (libraryObjs[methodName]) {
            /* istanbul ingore next */
            if (cache[libraryName] === 2) {
              throw Error('[babel-plugin-component] If you are using both' + 'on-demand and importing all, make sure to invoke the' + ' importing all first.');
            }

            if (styleRoot) {
              path = "".concat(cachePath[libraryName]).concat(styleRoot).concat(ext);
            } else {
              path = "".concat(cachePath[libraryName]).concat(_root || '/index').concat(ext);
            }

            cache[libraryName] = 1;
          } else {
            if (cache[libraryName] !== 1) {
              /* if set styleLibrary.path(format: [module]/module.css) */
              var parsedMethodName = parseName(methodName, camel2Dash);

              if (modulePathTpl) {
                var modulePath = modulePathTpl.replace(/\[module]/ig, parsedMethodName);
                path = "".concat(cachePath[libraryName], "/").concat(modulePath);
              } else {
                path = "".concat(cachePath[libraryName], "/").concat(parsedMethodName).concat(ext);
              }

              if (mixin && !isExist(path)) {
                path = style === true ? "".concat(_path, "/style").concat(ext) : "".concat(_path, "/").concat(style);
              }

              if (isBaseStyle) {
                addSideEffect(file.path, "".concat(cachePath[libraryName], "/base").concat(ext));
              }

              cache[libraryName] = 2;
            }
          }

          addDefault(file.path, path, {
            nameHint: methodName
          });
        } else {
          if (style === true) {
            addSideEffect(file.path, "".concat(path, "/style").concat(ext));
          } else if (style) {
            addSideEffect(file.path, "".concat(path, "/").concat(style));
          }
        }
      }

      return selectedMethods[methodName];
    }

    function buildExpressionHandler(node, props, path, state) {
      console.log('buildExpressionHandler', props);
      var file = path && path.hub && path.hub.file || state && state.file;
      props.forEach(function (prop) {
        if (!types.isIdentifier(node[prop])) return;

        if (specified[node[prop].name]) {
          node[prop] = importMethod(node[prop].name, file, state.opts); // eslint-disable-line
        }
      });
    }

    function buildDeclaratorHandler(node, prop, path, state) {
      console.log('buildDeclaratorHandler',node, prop);
      var file = path && path.hub && path.hub.file || state && state.file;
      if (!types.isIdentifier(node[prop])) return;

      if (specified[node[prop].name]) {
        node[prop] = importMethod(node[prop].name, file, state.opts); // eslint-disable-line
      }
    }
    return {
      visitor: {
        Program: function Program(path) {
          // console.log('enter',path)
        },
        VariableDeclarator: function VariableDeclarator(path, state) {
          var node = path.node;
          buildDeclaratorHandler(node, 'init', path, state);
        },
        FunctionExpression(path) { 
          console.log('FunctionExpression',path)
        },
        FunctionDeclaration(path) { 
          console.log('FunctionDeclaration',path)
        },
        LogicalExpression: function LogicalExpression(path, state) {
          var node = path.node;
          buildExpressionHandler(node, ['left', 'right'], path, state);
        },
        ConditionalExpression: function ConditionalExpression(path, state) {
          var node = path.node;
          buildExpressionHandler(node, ['test', 'consequent', 'alternate'], path, state);
        },
        IfStatement: function IfStatement(path, state) {
          var node = path.node;
          buildExpressionHandler(node, ['test'], path, state);
          buildExpressionHandler(node.test, ['left', 'right'], path, state);
        }
      }
    }
  }
}