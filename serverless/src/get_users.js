const crud = require ('./common/crud')

const handler = crud.query (`
  SELECT id, name
  FROM blog.users
`) (() => () => []) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
