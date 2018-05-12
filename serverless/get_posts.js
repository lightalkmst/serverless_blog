// TODO: returns ONLY the metadata for the posts so that they can be searched and primed
const { Client } = require ('pg')
const client = new Client ()

exports.handler = async event => {
  await client.connect ()
  const res = await client.query ('SELECT $1::text as message')
  // console.log(res.rows[0].message) // Hello world!
  await client.end ()

  // TODO implement
  var response = {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {},
      body: JSON.stringify (res),
  }
  return response
}
