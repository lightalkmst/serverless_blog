const crud = require ('./common/crud')

// const handler = crud.query (`
//   UPDATE blog.featured
//   SET post_id = $2::INTEGER
//   WHERE id = $1::INTEGER
// `) (user_id => event => [event.body.id, event.body.post_id]) (crud.id)

const handler = crud.query (`
  INSERT INTO user_logins (username, logins)
  VALUES ('Naomi',1),('James',1)
  ON CONFLICT (username)
  DO UPDATE SET logins = user_logins.logins + EXCLUDED.logins;
`) (user_id => event => [event.body.id, event.body.post_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
