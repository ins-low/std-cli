const  chalk  = require('chalk')
// const getGlobalInstallCommand = require('./getGlobalInstallCommand')

module.exports = function loadCommand (commandName, moduleName) {
  const isNotFoundError = err => {
    return err.message.match(/Cannot find module/)
  }
  try {
    return require(moduleName)
  } catch (err) {
    if (isNotFoundError(err)) {
      try {
        return require('import-global')(moduleName)
      } catch (err2) {
        if (isNotFoundError(err2)) {
          console.log()
          console.log(
            `  Command ${chalk.cyan(`std-cli ${commandName}`)} requires a global addon to be installed.\n` 
            
          )
          console.log()
          process.exit(1)
        } else {
          throw err2
        }
      }
    } else {
      throw err
    }
  }
}
