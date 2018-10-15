const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, email, name, roles, verified
  FROM blog.users
  WHERE (id = $1::INTEGER)
`) (user_id => event => [event.queryStringParameters.id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
