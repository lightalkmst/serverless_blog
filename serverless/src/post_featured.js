const crud = require ('./common/crud')

const handler = crud.query (`
  INSERT INTO blog.featured
  VALUES (
    $1::INTEGER,
    $2::INTEGER
  )
  ON CONFLICT (id)
  DO UPDATE SET
    post_id = $2::INTEGER
  RETURNING *
`) (user_id => event => [event.body.id, event.body.post_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
