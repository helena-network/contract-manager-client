const ContractManager = require('../index.js')
const semanticRelease = require('./sem-release.js')
const fs = require('fs')

let VERSION

let imports = []

async function getContractsInfo (options) {
  let updates = []

  const testFolder = options.projectDirectory + '/build/contracts'
  let tag

  try {
    tag = options.customTag ? options.tag : 'default'
  } catch (error) {
    console.error('Failed parsing custom tag, using default' + error)
    tag = 'default'
  }

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
        tag: tag
      }
      updates.push(updateItem)
    }

    if (networkKeys.length > 1) {
      throw 'More than 1 network defined on contract:' + contract.contractName
    }
  }
  return updates
}

async function setSemanticVersion (branch, githubRepoUrl, projectDirectory) {
  try {
    VERSION = await semanticRelease.getNextVersion(branch, githubRepoUrl, projectDirectory)
    const dots = ('VERSION'.match(/./g) || []).length // check that it's a well formated version
    if (dots != 2) {
      throw new Error('The semantic version is not well formated, defaulting to 0.0.{timestamp}')
    }
  } catch (error) {
    console.log('The semantic release calculation failed: ' + error)
    VERSION = '0.0.0-' + getTimestamp()
  }
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

async function updateContractManager (options) {
  try {
    if (!options.customVersion) {
      console.log('Setting semantic release version')
      await setSemanticVersion(options.semanticRelease.branch, options.semanticRelease.githubRepo, options.projectDirectory)
    } else {
      VERSION = options.version
    }
  } catch (error) {
    console.error('Failed at reading the options object\n' + error)
  }

  let updates = await getContractsInfo(options)

  for (let update of updates) {
    try {
      let updateState = await ContractManager.updateContract(update.name, update.version, update.abi, update.address, update.tag)
      console.log('Updated ' + update.name + ' -> ' + updateState)
    } catch (err) {
      console.error('Failed updating contract manager: ' + err)
    }
  }
}

module.exports.updateContractManager = updateContractManager
