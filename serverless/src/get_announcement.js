const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, user_id, title, summary, created, updated, tags, published, body
  FROM blog.announcements
  WHERE (published OR user_id = $1::INTEGER) AND id = $2::INTEGER
`) (user_id => event => [user_id, event.queryStringParameters.id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)