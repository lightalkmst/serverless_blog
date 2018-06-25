const crud = require ('./common/crud')

const handler = crud.query (`
  DELETE FROM blog.posts
  WHERE user_id = $1::INTEGER AND id = $2::INTEGER
`) (user_id => event => [user_id, event.queryStringParameters.id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
