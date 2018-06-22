const crud = require ('./common/crud')

// TODO: returns ONLY the metadata for the posts so that they can be searched and primed
const handler = crud.query ('SELECT id, title, summary, created, tags FROM blog.posts WHERE published OR user_id = $1::INTEGER') (() => user_id => () => [user_id]) (crud.id)

exports && (exports.handler = handler)
module && (module.exports = handler)
