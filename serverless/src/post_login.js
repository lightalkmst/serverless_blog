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
  return format (
    !resp.rows.length || !bcrypt.compareSync (event.body.pass, resp.rows[0].pass)
    ? {body: {error: 'email and password combination not found'}}
    : {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Set-Cookie': generate_cookie (resp.rows[0].id) (resp.rows[0].pass),
      },
      body: {
        auth: true,
        response: resp.rows[0].roles,
      },
    }
  )
}

exports && (exports.handler = handler)
module && (module.exports = handler)
