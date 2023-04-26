const path = require("path");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);

compiler.run((err, stats,errs) => {
  
  if (err) {
    console.log('error.1:',err.stack || err)
    if (err.details) {
      console.log('error.2:',err.details)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    if (info.errors && info.errors.length > 0) {
      info.errors.forEach((error, index) => {
        console.log('************************* error start  **************************************************');
        Object.keys(error).forEach(err => {
          console.log(`error.${index}.${err} :`,error[err])
        })
        console.log('************************* error end  **************************************************');
      })
    }
    
  }

  if (stats.hasWarnings()) {
    console.log('warning:',info.warnings)
  }
})