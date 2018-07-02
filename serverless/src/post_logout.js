const bcrypt = require ('bcryptjs')

const {format} = require ('./common/crud')
const cfg = require ('./common/config')

const handler = async event => {
  cfg.local || await client.end ()
  return format ({
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      'Set-Cookie': 'session=',
    },
    body: {
      auth: false,
      response: null,
    },
  })
}

exports && (exports.handler = handler)
module && (module.exports = handler)
