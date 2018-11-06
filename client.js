const request = require('request')
const config = require('./config.js')

const endpoint = config.endpoint + config.port + config.route

function updateContract (_name, _version, _abi, _address) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: endpoint + '/deploy',
      headers:
      { 'cache-control': 'no-cache',
        'Content-Type': 'application/json' },
      body:
      { name: _name,
        version: _version,
        abi: _abi,
        address: _address},
      json: true }

    request(options, function (error, response, body) {
      if (error) reject(error)
      resolve(body)
    })
  })
}

module.exports.updateContract = updateContract
