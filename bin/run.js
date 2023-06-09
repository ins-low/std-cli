#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const chalk = require('chalk');
const semver = require('semver');
const requiredVersion = require('../package.json').engines.node
const leven = require('leven')

function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted, {
            includePrerelease: true
        })) {
        console.log(chalk.red(
            'You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
        ))
        process.exit(1)
    }
}

checkNodeVersion(requiredVersion, 'std-cli')

const fs = require('fs')
const path = require('path')
const slash = require('slash')
const minimist = require('minimist')

// enter debug mode when creating test repo


const program = require('commander')
const loadCommand = require('../src/loadCommand')

program
    .version(`std-cli ${require('../package').version}`)
    .usage('<command> [options]')

program
    .command('updata-libs <url>')
    .description('更新 src/bw-libs 文件夾内的文件')
    .option('--github', '是否在GITHUT上的地址')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/index')(plugin, options, minimist(process.argv.slice(3)))
    })


program
    .command('choice <option>')
    .description('选择项目')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/cli-template/index')(plugin, options, minimist(process.argv.slice(3)))
    })

program
    .command('rules <url>')
    .description('更新 bw-builds 文件夾内的文件,項目構建文件，包括eslint,prettier')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/cli-builds')(plugin, options, minimist(process.argv.slice(3)))
    })

program
    .command('info')
    .description('print debugging information about your environment')
    .action((cmd) => {
        console.log(chalk.bold('\nEnvironment Info:'))
        require('envinfo').run({
            System: ['OS', 'CPU'],
            Binaries: ['Node', 'Yarn', 'npm'],
            Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
            npmPackages: '/**/{typescript,*vue*,@vue/*/}',
            npmGlobalPackages: ['std-cli']
        }, {
            showNotFound: true,
            duplicates: true,
            fullTree: true
        }).then(console.log)
    })

// output help information on unknown commands
program.on('command:*', ([cmd]) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    suggestCommands(cmd)
    process.exitCode = 1
})

// add some useful info on help
program.on('--help', () => {
            console.log()
            console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
// const enhanceErrorMessages = require('../lib/util/enhanceErrorMessages')

// enhanceErrorMessages('missingArgument', argName => {
//   return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
// })

// enhanceErrorMessages('unknownOption', optionName => {
//   return `Unknown option ${chalk.yellow(optionName)}.`
// })

// enhanceErrorMessages('optionMissingArgument', (option, flag) => {
//   return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
//     flag ? `, got ${chalk.yellow(flag)}` : ``
//   )
// })

program.parse(process.argv)

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  let suggestion

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}