const { Client } = require ('pg')
const config = require ('./config')

const client = new Client ({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
})

const get_creds = user_id =>
  (await client.query ({
    text: 'SELECT password, role FROM users WHERE id = $1::INTEGER',
    values: [~~cookies.user_id],
  }))[0]

const authenticate = cookies => password =>
  cookies.user_id && parseInt (cookies.user_id)
  && cookies.timestamp && parseInt (cookies.timestamp)
  && password
  && bcrypt.compareSync (`${cookies.user_id % 1000}${cookies.timestamp % 1000}${password}`, cookies.session_token)

const generate_token = user_id => password => bcrypt.hashSync (`${cookies.user_id % 1000}${new Date ().getTime () % 1000}${password}`, config.rounds)

// user cookie: {
//   user_id
//   timestamp
//   session_token
// }
const query = query => f1 => f2 => async event => {
  await client.connect ()
  // authenticate
  //   get user id, timestamp, and token from cookie
  //   query db for password hash
  //   authenticated if matched
  const cookies = {}
  (event.headers.Cookie || '').split (';')
    .filter (x => x)
    .map (x => x.split ('='))
    .forEach (([k, v]) => cookies[k] = v)
  const {password, role} = cookies.user_id && parseInt (cookies.user_id) ? get_creds (cookies.user_id) || {} : {}
  const authenticated = authenticate (cookies) (password)
  // transact
  //   db calls for the operation
  const req = {
    text: query,
    values: f1 (authenticated) (cookies.user_id) (event),
  }
  const res = await client.query (req)
  await client.end ()
  // refresh session token if authenticated
  //   generate new timestamp and token
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: (
      authenticated
      ? {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Set-Cookie': generate_token (cookies.user_id) (password),
      }
      : {}
    ),
    body: JSON.stringify ({
      authenticated,
      response: f2 (authenticated) (cookies.user_id) (res),
    }),
  }
}

module.exports = {
  id: () => () => x => x,
  query,
  authenticate,
  generate_token,
}


/*
{
  "resource": "/event_and_context_test",
  "path": "/event_and_context_test",
  "httpMethod": "GET",
  "headers": null,
  "queryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "path": "/event_and_context_test",
    "accountId": "756796336949",
    "resourceId": "tur4vo",
    "stage": "test-invoke-stage",
    "requestId": "test-invoke-request",
    "identity": {
      "cognitoIdentityPoolId": null,
      "cognitoIdentityId": null,
      "apiKey": "test-invoke-api-key",
      "cognitoAuthenticationType": null,
      "userArn": "arn:aws:iam::756796336949:root",
      "apiKeyId": "test-invoke-api-key-id",
      "userAgent": "userAgent",
      "accountId": "756796336949",
      "caller": "756796336949",
      "sourceIp": "sourceIp",
      "accessKey": "ASIAIPDM6AFIHXUASCWA",
      "cognitoAuthenticationProvider": null,
      "user": "756796336949"
    },
    "resourcePath": "/event_and_context_test",
    "httpMethod": "GET",
    "extendedRequestId": "test-invoke-extendedRequestId",
    "apiId": "dxdv5uynr1"
  },
  "body": null,
  "isBase64Encoded": false
}
*/
