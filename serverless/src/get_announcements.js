const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, title, summary, published, updated, tags
  FROM blog.announcements
  WHERE published IS NOT NULL OR user_id = $1::INTEGER
  ORDER BY updated ASC
`) (user_id => () => [user_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
