#!/usr/bin/env node

var program = require('commander')
const index = require('./index.js')

let settings = {
  githubRepo: false,
  branch: false,
  projectDirectory: false
}

let options = {
  customVersion: false,
  customTag: false,
  semanticRelease: {
    branch: false,
    githubRepoUrl: false
  }
}

program
  .version('0.1.0')

  .option('-c, --config [file]', 'Pass a configuration file')
  .option('-g, --githubRepo [repoUrl]', 'Set github repo')
  .option('-d, --buildDir [directory]', 'Set build directory')
  .option('-b, --branch [git-branch]', 'Set github branch')
  .option('-r, --releaseVersion [releaseVersion]', 'Set custom version')
  .option('-t, --tag [tag]', 'Set release tag')

  .parse(process.argv)

console.log('Passed the following args:')
if (program.config) {
  console.log('  - config file' + program.config)
  try {
    const configFile = require(program.config)
    if (configFile.GITHUB_REPO) {
      options.customVersion = false
      options.semanticRelease.githubRepo = configFile.GITHUB_REPO
    }
    if (configFile.BRANCH) {
      options.customVersion = false
      options.semanticRelease.branch = configFile.BRANCH
    }
    if (configFile.PROJECT_DIR) {
      options.projectDirectory = configFile.PROJECT_DIR
    }
  } catch (error) {
    console.error('Failed to parse configuration file\n' + error)
  }
}
if (program.githubRepo) {
  options.semanticRelease.githubRepo = program.githubRepo
  console.log('Set github repo')
}

if (program.buildDir) {
  options.projectDirectory = program.buildDir
}
if (program.branch) {
  options.semanticRelease.branch = program.branch
}

if (program.releaseVersion) {
  options.customVersion = true
  options.version = program.releaseVersion
}
if (program.tag) {
  options.customTag = true
  options.tag = program.tag
}
console.log('Settings: \n' + JSON.stringify(options))

try {
  index.updateContractManager(options)
} catch (error) {
  console.error('Failed at calling contract manager' + error)
}
console.log('End')
