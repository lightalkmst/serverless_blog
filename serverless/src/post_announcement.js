const crud = require ('./common/crud')

const handler = crud.query (`
  INSERT INTO blog.announcements
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
`) (user_id => event => []) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
