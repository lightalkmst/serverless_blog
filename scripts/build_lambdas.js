const fs = require ('fs')
const archiver = require ('archiver')
require ('green_curry') (['globalize', 'short F.c'])

// create build folder
fs.existsSync ('build/serverless') || fs.mkdirSync ('build/serverless')

// create a zip archive for each lambda
F.p (fs.readdirSync('serverless/src/')) (
  A.filter (file => ! fs.lstatSync (`serverless/src/${file}`).isDirectory ())
  >> A.iter (file => {
    const output = fs.createWriteStream (`build/serverless/${file}.zip`)
    const archive = archiver ('zip', {zlib: {level: 9}})
    // catch warnings and errors explicitly
    A.iter (x => archive.on (x, err => {
      F.log (err)
      throw err
    })) (['warning', 'error'])
    archive.pipe (output)

    archive.file (`serverless/src/${file}`, {name: 'index.js'})
    archive.directory ('serverless/node_modules/', 'node_modules')
    archive.directory ('serverless/src/common/', 'common')

    archive.finalize ()
  })
)
