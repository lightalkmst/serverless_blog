const bcrypt = require ('bcryptjs')

const {client, authenticate, generate_cookie, format} = require ('./common/crud')
const cfg = require ('./common/config')

const handler = async event => {
  const resp =
    await client.query (`
      SELECT id, pass, roles
      FROM blog.users
      WHERE email = $1::TEXT
    `, [event.body.email.toLowerCase ()])
  cfg.local || await client.end ()
  const user = resp.rows[0]
  return format (
    !user || !bcrypt.compareSync (`${event.body.pass}${cfg.salt}`, user.pass)
    ? {
      body: {
        error: 'email and password combination not found',
        response: {},
      },
    }
    : {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Set-Cookie': generate_cookie (user.id) (user.pass),
      },
      body: {
        auth: true,
        response: {
          ...user,
          pass: undefined,
        },
      },
    }
  )
}

exports && (exports.handler = handler)
module && (module.exports = handler)
