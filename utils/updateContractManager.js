// const ContractManager = require('@frontier-token-research/contract-manager-client')
const ContractManager = require('../index.js')
const semanticRelease = require('./sem-release.js')

const fs = require('fs')
let VERSION

let imports = []

// const truffleBuildDirectory = PROJECT_DIR + '/build'

async function getContractsInfo (branch, githubRepoUrl, projectDir) {
  let updates = []
  await setVersion(branch, githubRepoUrl, projectDir)

  const testFolder = projectDir + '/build/contracts'

  try {
    fs.readdirSync(testFolder).forEach(file => {
      imports.push(require(testFolder + '/' + file))
    })
  } catch (error) {
    console.error('Error reading build directory:' + error)
  }

  for (let contract of imports) {
    let networkKeys
    try {
      let contractNetworks = contract.networks
      networkKeys = Object.keys(contractNetworks)
    } catch (error) {
      console.error('Error parsing network: ' + error)
    }

    if (networkKeys.length == 1) {
      const updateItem = {
        name: contract.contractName,
        address: contract.networks[networkKeys[0]].address,
        abi: contract,
        version: VERSION,
        tag: 'dev'
      }
      updates.push(updateItem)
    }

    if (networkKeys.length > 1) {
      throw 'More than 1 network defined on contract:' + contract.contractName
    }
  }
  return updates
}

async function setVersion (branch, githubRepoUrl, projectDir) {
  VERSION = await semanticRelease.getNextVersion(branch, githubRepoUrl, projectDir)
  // if(VERSION)
  // VERSION = '0.0.0-' + getTimestamp()
}

function getVersion () {
  let TRL_VERSION = process.env.TRL_VERSION

  if (typeof TRL_VERSION !== 'undefined' && TRL_VERSION) {
    if (TRL_VERSION.indexOf('.') > -1) {
      return TRL_VERSION
    } else {
      return '0.0.0-' + getTimestamp()
    }
  } else {
    return '0.0.0-' + getTimestamp()
  }
}

function getTimestamp () {
  return Date.now() / 1000 | 0
}

async function updateContractManager (branch, githubRepoUrl, projectDir) {
  let updates = await getContractsInfo(branch, githubRepoUrl, projectDir)

  for (let update of updates) {
    try {
      let updateState = await ContractManager.updateContract(update.name, update.version, update.abi, update.address, update.tag)
      console.log('Updated ' + update.name + ' -> ' + updateState)
    } catch (err) {
      console.error('Failed updating contract manager: ' + err)
    }
  }
}

// Main flow
// const GITHUB_REPO = 'git@github.com:Frontier-project/TRL.git'
// const BRANCH = 'FTR-261/feat/get-automatic-compensation-deployed-on-develop'
// const PROJECT_DIR = '/Users/boss/git/frontier/trl-project/trl'
// updateContractManager(BRANCH, GITHUB_REPO, PROJECT_DIR)

module.exports.updateContractManager = updateContractManager
