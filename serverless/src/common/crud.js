const {Client} = require ('pg')
const bcrypt = require ('bcryptjs')

// the necessary configurations are: user, host, database, password, port, rounds, salt
const cfg = require ('./config')

const client = new Client ({
  user: cfg.user,
  host: cfg.host,
  database: cfg.database,
  password: cfg.password,
  port: cfg.port,
})
;(async () => await client.connect ()) ()

const get_creds = async user_id =>
  (await client.query (`
    SELECT pass, roles
    FROM blog.users
    WHERE id = $1::INTEGER
  `, [user_id])).rows[0]

const generate_base = user_id => timestamp => password => `${user_id % 1000000000}${timestamp % 1000}${password}`

const authenticate = user_id => timestamp => password => token =>
  bcrypt.compareSync (generate_base (user_id) (timestamp) (password), token)

const generate_cookie = user_id => password => {
  const timestamp = new Date ().getTime ()
  const token = bcrypt.hashSync (generate_base (user_id) (timestamp) (password), cfg.rounds)
  return `session=${token}-${user_id}-${timestamp}; Max-Age=${cfg.session_duration}`
}

const format = args => ({
  isBase64Encoded: false,
  statusCode: 200,
  headers: {
    ...(args.headers || {}),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  body: JSON.stringify (args.body),
  error: args.error,
})

// user cookie: {
//   user_id
//   timestamp
//   session_token
// }
const query = query => pre => post => async event => {
  // authenticate
  //   get user id, timestamp, and token from cookie
  //   query db for password hash
  //   authenticated if matched
  const [, token, user_id, timestamp] = /^session=(.*)-(.*)-(.*)$/.exec (event.headers.Cookie || '') || []
  const {pass, roles} = user_id && await get_creds (user_id) || {}
  const auth = token && user_id && timestamp && pass && authenticate (user_id) (timestamp) (pass) (token)
  // transact
  //   db calls for the operation
  const req = {
    text: query,
    values: pre (auth && user_id || -1) (event),
  }
  const res = (await client.query (req)).rows
  cfg.local || await client.end ()
  // refresh session token if authenticated
  //   generate new timestamp and token
  return format ({
    headers: (
      auth && {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Set-Cookie': generate_cookie (user_id) (pass),
      }
    ),
    body: {
      auth,
      response: post (auth && user_id || -1) (res),
    },
  })
}

module.exports = {
  id: () => x => x,
  query,
  authenticate,
  generate_cookie,
  format,
  client,
}
