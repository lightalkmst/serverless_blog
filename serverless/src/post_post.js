const crud = require ('./common/crud')

const handler = async event =>
  crud.query (`
    INSERT INTO blog.posts
    VALUES (
      ${event.body.id == '0' ? 'default' : '$7::INTEGER'},
      $1::INTEGER,
      $2::TEXT,
      $3::TEXT,
      $4::LOCALTIMESTAMP,
      LOCALTIMESTAMP,
      $5::TEXT,
      $6::TEXT
    )
    ON CONFLICT (id)
    DO UPDATE SET
      title = $2::TEXT,
      summary = $3::TEXT,
      published = $4::BOOLEAN,
      updated = LOCALTIMESTAMP,
      tags = $5::TEXT,
      body = $6::TEXT
    RETURNING *
  `) (user_id => event => [user_id, event.body.title, event.body.summary, event.body.published, event.body.tags, event.body.body, ...(event.body.id == '0' ? [] : [event.body.id])]) (crud.id) (event)

exports && (exports.handler = handler)
module && (module.exports = handler)
