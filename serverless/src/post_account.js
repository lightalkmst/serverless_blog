const bcrypt = require ('bcryptjs')

const {client, authenticate, generate_token, format} = require ('./common/crud')
const cfg = require ('./common/config')

const handler = async event => {
  try {
    await client.query ('BEGIN')
    const pass$ = bcrypt.hash (event.body.pass, cfg.rounds)
    const resp$ =
      client.query (`
        SELECT TRUE
        FROM blog.users
        WHERE email = $1::TEXT
        LIMIT 1
      `, [event.body.email.toLowerCase ()])
    const pass = await pass$
    const resp = await resp$
    if (resp.rows.length) {
      return format ({body: {error: 'email already in use'}})
    }
    const resp2 =
      await client.query (`
        INSERT INTO blog.users
        VALUES (
          DEFAULT,
          $1::TEXT,
          $2::TEXT,
          $3::TEXT,
          'user',
          FALSE,
          LOCALTIMESTAMP
        )
        RETURNING id, roles
      `, [event.body.email.toLowerCase (), bcrypt.hashSync (event.body.pass, cfg.rounds), event.body.user])
    await client.query ('COMMIT')
    return format ({
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Set-Cookie': generate_token (resp2.rows[0].id) (pass),
      },
      body: {
        auth: true,
        response: resp2.rows[0].roles,
      },
    })
  }
  catch (e) {
    await client.query ('ROLLBACK')
    return format ({body: {error: e.toString ()}})
  }
}

exports && (exports.handler = handler)
module && (module.exports = handler)
