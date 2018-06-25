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
    SELECT password, roles
    FROM users
    WHERE id = $1::INTEGER
  `, [~~cookies.user_id]))[0]

const authenticate = cookies => password =>
  cookies.user_id && parseInt (cookies.user_id)
  && cookies.timestamp && parseInt (cookies.timestamp)
  && password
  && bcrypt.compareSync (`${cookies.user_id % 1000}${cookies.timestamp % 1000}${password}`, cookies.session_token)

const generate_token = user_id => password => `session=${bcrypt.hashSync (`${user_id % 1000}${new Date ().getTime () % 1000}${password}`, cfg.rounds)}`

const format = args => ({
  isBase64Encoded: false,
  statusCode: 200,
  headers: args.headers || {},
  body: JSON.stringify (args.body),
  error: args.error,
})

// user cookie: {
//   user_id
//   timestamp
//   session_token
// }
const query = query => pre => post => async event => {
  // try {
    // authenticate
    //   get user id, timestamp, and token from cookie
    //   query db for password hash
    //   authenticated if matched
    const cookies = {}
    ;(event.headers.Cookie || '').split (';')
      .filter (x => x)
      .map (x => x.split ('='))
      .forEach (([k, v]) => cookies[k] = v)
    const {password, roles} = cookies.user_id && parseInt (cookies.user_id) ? get_creds (cookies.user_id) || {} : {}
    const auth = authenticate (cookies) (password)
    // transact
    //   db calls for the operation
    const req = {
      text: query,
      values: pre (auth && cookies.user_id) (event),
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
          'Set-Cookie': generate_token (cookies.user_id) (password),
        }
      ),
      body: {
        auth,
        response: post (auth && cookies.user_id) (res),
      },
    })
  // }
  // catch (e) {
  //   return format ({error: 'unknown'})
  // }
}

module.exports = {
  id: () => x => x,
  query,
  authenticate,
  generate_token,
  format,
  client,
}
