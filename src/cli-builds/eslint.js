const inquired = require('inquirer');
const optionSchemas = require('../cli-share/schema');
module.exports = async ()=> {
  const { actions } = await inquired.prompt([
    {
      name: 'select build tools',
      type: 'list',
      message: '',
      choices:optionSchemas.map(item=>item[0])
    }
  ])
}