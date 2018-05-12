// require modules
const fs = require ('fs')
var archiver = require ('archiver')
require ('green_curry') (['globalize', 'short F.c'])

// repeat for each Lambda

F.p (fs.readdirSync('serverless/src/')) (
  A.filter (file => ! fs.lstatSync (`serverless/src/${file}`).isDirectory ())
  // >> A.map (F.id)
  // >> F.log
  >> A.iter (file => {
    // create a file to stream archive data to.
    const output = fs.createWriteStream (`build/serverless/${file}.zip`)
    const archive = archiver ('zip', {zlib: {level: 9}})
    // good practice to catch warnings  (ie stat failures and other non-blocking errors)
    archive.on ('warning', err => {
      F.log (err)
      if  (err.code != 'ENOENT') {
        throw err
      }
    })
    // good practice to catch this error explicitly
    archive.on ('error', err => {
      F.log (err)
      throw err
    })
    archive.pipe (output)

    archive.file (`serverless/src/${file}`, {name: file})
    archive.directory ('serverless/node_modules/', 'node_modules')
    archive.directory ('serverless/src/common/', 'common')

    // finalize the archive  (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize ()
  })
)
