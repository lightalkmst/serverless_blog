////////////////
//            //
// INITIALIZE //
//            //
////////////////

var fs = require ('fs')

// my libraries
require ('green_curry') (['globalize', 'short F.c'])

// config
var cfg = {}//eval (fs.readFileSync ('config.jsx', 'utf8'))

////////////////
//            //
// INITIALIZE //
//            //
////////////////

var http = require ('http')

var express = require ('express')
var app = express ()
var bodyParser = require ('body-parser')
app.use (bodyParser.urlencoded ({extended: false}))
app.use (bodyParser.json ())

var request = require ('request')

/////////////
//         //
// ROUTING //
//         //
/////////////

var get_header = x => ({
  'Content-Type': 'text/' + {
    css: 'css',
    html: 'html',
    js: 'javascript',
    plain: 'plain',
  } [x],
  'Expires': new Date ().toUTCString (),
  'Cache-Control': 'no-store',
})

var write = res => (...r) => {
  res.writeHead (r[0], get_header (r[1]))
  res.write (r[2])
  res.end ()
}

var rest = m => x => f => app[m] ('/' + x, f)

var [get, post, put, del, all] = A.map (rest) (['get', 'post', 'put', 'delete', 'all'])

//////////////
//          //
// REST API //
//          //
//////////////

// require, wrap, and subscribe apis from ../serverless
// exports.handler = (event, context, callback) => {
//     // Succeed with the string "Hello world!"
//     callback(null, 'Hello world!')
// }

// TODO
// var [api_get, api_post, api_put, api_del, api_all] = A.map (f => path => api => f (path) (api)) ([get, post, put, del, all])

// api_get ()

//////////////////
//              //
// FILE SERVING //
//              //
//////////////////

var serve_static_file = web_path => file_path => type => {
  var file = fs.readFileSync (file_path)
  get (web_path) ((req, res) => write (res) (200, type, file))
}

A.iter (([web_path, file_path, type]) => serve_static_file (web_path) (file_path) (type)) ([
  ['bundle.js', 'build/client/bundle.js', 'js'],
  ['favicon.ico', 'build/client/favicon.png', 'html'],
  ['', 'build/client/index.html', 'html'],
])

// var does_not_exist = (() => {
//   var file = fs.readFileSync ('frontend/html/404.html')
//   return (req, res) => {
//     log ('Attempted to access nonexistent resource ' + req.url)
//     write (res) (404, 'html', file)
//   }
// }) ()

// get ('*') (does_not_exist)

app.listen (cfg.port || 8080)
F.log ('Server is ready')
