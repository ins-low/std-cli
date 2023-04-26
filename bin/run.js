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


/**
 * @description excel2i18n 把excel的i18n信息轉成json文件
 * [outputUrl] 轉換后的輸出目錄
 * @example stdlib-cli excel2i18n --trans [outputUrl]
 */
program
    .command('excel2i18n [outputUrl]')
    .description('把excel的i18n信息轉成json文件輸出到[outputUrl]')
    .option('--init', '是否在GITHUT上的地址')
    .option('--trans', '是否在GITHUT上的地址')
    .allowUnknownOption()
    .action((plugin, options) => {
        if (process.argv.includes('--init')) {
          options.init = true;
        }
        if (process.argv.includes('--trans')) {
            options.trans = true;
          }
        require('../src/cli-service/excel2i18n/excel2i18n.js')(plugin, options, minimist(process.argv.slice(3)))
    })
//babel-change-template
program
    .command('change-template')
    .description('修改方法$t')
    .allowUnknownOption()
    .action((plugin, options) => {
        require('../src/cli-share/change-template/index')(plugin, options, minimist(process.argv.slice(3)))
    })
//babel-i18n
program
    .command('i18n')
    .description('添加方法到$t')
    .allowUnknownOption()
    .action((plugin, options) => {
        require('../src/cli-share/i18n/index')(plugin, options, minimist(process.argv.slice(3)))
    })

//babel-trans
program
    .command('trans')
    .description('編譯')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/cli-trans/index')(plugin, options, minimist(process.argv.slice(3)))
    })

//babel-ttf2woff
program
    .command('ttf2woff <source> <target>')
    .description('把ttf文件轉換為woff文件 tar foo')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/cli-service/ttf2woff/ttf2woff.js')(plugin, options, minimist(process.argv.slice(3)))
    })

//添加eslint和prettier 配置
program
    .command('build-tools <url>')
    .description('更新 bw-builds 文件夾内的文件,項目構建文件，包括eslint,prettier')
    .allowUnknownOption()
    .action((plugin, options) => {
        // if (process.argv.includes('--github')) {
        //   options.isGitHut = true;
        // }
        require('../src/cli-builds/eslint')(plugin, options, minimist(process.argv.slice(3)))
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