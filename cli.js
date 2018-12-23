#!/usr/bin/env node

var program = require('commander')
const index = require('./index.js')

let settings = {
  githubRepo: false,
  branch: false,
  projectDirectory: false
}

program
  .version('0.1.0')

  .option('-c, --config [file]', 'Pass a configuration file')
  .option('-g, --githubRepo [repoUrl]', 'Set github repo')
  .option('-d, --buildDir [directory]', 'Set build directory')
  .option('-b, --branch [git-branch]', 'Set github branch')

  .parse(process.argv)

console.log('Passed the following args:')
if (program.config) {
  console.log('  - config file' + program.config)
  try {
  	const configFile = require(program.config)
  	if (configFile.GITHUB_REPO) {
  		settings.githubRepo = configFile.GITHUB_REPO
  	}
  	if (configFile.BRANCH) {
  		settings.branch = configFile.BRANCH
  	}
  	if (configFile.PROJECT_DIR) {
  		settings.projectDirectory = configFile.PROJECT_DIR
  	}
  } catch (error) {
  	console.error('Failed to parse configuration file\n' + error)
  }
}
if (program.githubRepo) {
  settings.githubRepo = program.githubRepo
  console.log('Set github repo')
}

if (program.buildDir) {
  settings.projectDirectory = program.buildDir
}
if (program.branch) {
  settings.branch = program.branch
}
console.log('Settings: \n' + JSON.stringify(settings))

try {
  index.updateContractManager(settings.branch, settings.githubRepo, settings.projectDirectory)
} catch (error) {
  console.error('Failed at calling contract manager' + error)
}
console.log('End')
