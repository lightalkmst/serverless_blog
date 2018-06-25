const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, title, created
  FROM blog.posts
  WHERE published OR user_id = $1::INTEGER
`) (user_id => () => [user_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
