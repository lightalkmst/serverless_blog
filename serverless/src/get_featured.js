const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT posts.id, title, summary, published, updated, tags
  FROM blog.featured featured INNER JOIN blog.posts posts
  ON featured.post_id = posts.id
  WHERE published IS NOT NULL OR user_id = $1::INTEGER
  ORDER BY featured.id ASC
`) (user_id => () => [user_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
