const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, user_id, replied_comment_id, comment, created, updated
  FROM blog.comments
  WHERE post_id = $1
`) (() => event => [event.queryStringParameters.post_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
