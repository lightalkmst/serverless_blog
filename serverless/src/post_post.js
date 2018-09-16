const crud = require ('./common/crud')

const handler = crud.query (`
  INSERT INTO blog.posts
  VALUES (
    default,
    $1::INTEGER,
    $2::TEXT,
    $3::TEXT,
    $4::TIMESTAMPTZ,
    $5::TIMESTAMPTZ,
    $6::TEXT,
    $7::BOOLEAN,
    $8::TEXT
  )
`) (user_id => event => [event.body.id, event.body.title, event.body.summary, event.body.created, event.body.updated, event.body.tags, event.body.published, event.body.body]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
