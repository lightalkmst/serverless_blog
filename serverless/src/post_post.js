const crud = require ('./common/crud')

const handler = async event =>
  crud.query (`
    INSERT INTO blog.posts
    VALUES (
      ${event.body.id == '0' ? 'default' : '$7::INTEGER'},
      $1::INTEGER,
      $2::TEXT,
      $3::TEXT,
      LOCALTIMESTAMP,
      LOCALTIMESTAMP,
      $4::TEXT,
      $5::BOOLEAN,
      $6::TEXT
    )
    ON CONFLICT (id)
    DO UPDATE SET
      title = $2::TEXT,
      summary = $3::TEXT,
      updated = LOCALTIMESTAMP,
      tags = $4::TEXT,
      published = $5::BOOLEAN,
      body = $6::TEXT
    RETURNING *
  `) (user_id => event => [user_id, event.body.title, event.body.summary, event.body.tags, event.body.published, event.body.body, ...(event.body.id == '0' ? [] : [event.body.id])]) (crud.id) (event)

exports && (exports.handler = handler)
module && (module.exports = handler)
