const customPlugin = require('./src/cli-share/plugin')('info')
module.exports = {
  "presets": [
    
  ],
  "plugins": [
    [customPlugin]
  ]
}