const semanticRelease = require('semantic-release')
// const {WritableStreamBuffer} = require('stream-buffers')

// const stdoutBuffer = WritableStreamBuffer()
// const stderrBuffer = WritableStreamBuffer()

async function getNextVersion (branchName, repoUrl, repoDirectory) {
  try {
    const result = await semanticRelease({
    // Core options
      branch: branchName,
      repositoryUrl: repoUrl,
      dryRun: true,
      ci: false
    }, {
      cwd: repoDirectory
    })

    if (result) {
      const {lastRelease, commits, nextRelease, releases} = result

      console.log('-------> NEXT_RELEASE IS: ' + nextRelease.version)
      return nextRelease.version
      console.log(`Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`)

      if (lastRelease.version) {
        console.log(`The last release was "${lastRelease.version}".`)
      }

      for (const release of releases) {
        console.log(`The release was published with plugin "${release.pluginName}".`)
      }
    } else {
      return false // the next version could not be calculated
    }
  } catch (err) {
    return false // the next version could not be calculated
  }
}

//getNextVersion('FTR-261/feat/get-automatic-compensation-deployed-on-develop',
//    'git@github.com:Frontier-project/TRL.git',
//    '/Users/boss/git/frontier/trl-project/trl'
//    )

module.exports.getNextVersion = getNextVersion	
/*
 branch: 'FTR-261/feat/get-automatic-compensation-deployed-on-develop',
      repositoryUrl: 'git@github.com:Frontier-project/TRL.git',
      dryRun: true,
      ci: false
    }, {
      cwd: '../'

*/
