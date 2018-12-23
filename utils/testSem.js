const sem = require('./sem-release.js')

async function main () {
  const nextVersion = await sem.getNextVersion('FTR-261/feat/get-automatic-compensation-deployed-on-develop',
   'git@github.com:Frontier-project/TRL.git',
   '/Users/boss/git/frontier/trl-project/trl'
   )
  console.log('RES: ' + nextVersion)
}

main()
