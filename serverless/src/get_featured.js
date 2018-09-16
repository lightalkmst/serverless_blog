const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT posts.id, title, summary, created, updated, tags, published
  FROM blog.featured featured RIGHT JOIN blog.posts posts
  ON featured.id = posts.id
  WHERE published OR user_id = $1::INTEGER
`) (user_id => () => [user_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
