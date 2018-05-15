const { Client } = require ('pg')
const db_config = require ('./db_config')

module.exports = {
  id: x => x,
  do: query => f1 => f2 => async event => {
    const client = new Client (db_config)
    const req = {
      text: query,
      values: f1 (event),
    }
    await client.connect ()
    const res = await client.query (req)
    // console.log(res.rows[0].message) // Hello world!
    await client.end ()
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: JSON.stringify (f2 (res)),
    }
  },
}
