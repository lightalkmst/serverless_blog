const crud = require ('./common/crud')

// TODO: returns ONLY the metadata for the posts so that they can be searched and primed
exports.handler = crud.query ('SELECT $1::text as first_name, select $2::text as last_name') (() => () => () => ['Brian', 'Carlson']) (crud.id)
