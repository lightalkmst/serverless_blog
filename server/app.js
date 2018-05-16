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


// Table: User
//   id PRIMARY KEY INTEGER,
//   username TEXT,
//   passhash TEXT,
//   email TEXT,
//
// Table: Posts
//   id PRIMARY KEY INTEGER,
//   user_id FOREIGN KEY INTEGER,
//   title TEXT,
//   post TEXT,
//   summary TEXT,
//   timestamp TIMESTAMPTZ,
//   tags TEXT,
//
// Table: Comments
//   id INTEGER,
//   user_id FOREIGN KEY INTEGER,
//   replied_comment_id INTEGER,
//   comment TEXT,
//   timestamp TIMESTAMPTZ,
//
// Table: Messages
//   id INTEGER,
//   user_from_id FOREIGN KEY INTEGER,
//   user_to_id FOREIGN KEY INTEGER,
//   message TEXT,
//   timestamp TIMESTAMPTZ,
var users_id = 1
var posts_id = 1
var comments_id = 1
var messages_id = 1
var db = {
  users: [],
  posts: [],
  comments: [],
  messages: [],
}

// get_posts
get ('posts') ((req, res) => {
  res.json ([])
    .end ()
})


//////////////////
//              //
// FILE SERVING //
//              //
//////////////////

var serve_static_file = web_path => file_path => type => get (web_path) ((req, res) => write (res) (200, type, fs.readFileSync (file_path)))

A.iter (([web_path, file_path, type]) => serve_static_file (web_path) (file_path) (type)) ([
  ['bundle.js', 'build/client/bundle.js', 'js'],
  ['favicon.ico', 'build/client/favicon.png', 'html'],
  ['catroomguardian.jpg', 'build/client/catroomguardian.jpg', 'plain'],
  ['yxyha.jpg', 'build/client/yxyha.jpg', 'plain'],
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

///////////////////
//               //
// HOT RELOADING //
//               //
///////////////////

var exec = require ('child_process').exec

var stdin = process.openStdin ()

stdin.addListener ('data', () => {
  F.log ('rebuilding')
  exec ('node scripts/build.js', () => F.log ('rebuilt'))
})

app.listen (cfg.port || 8080)
F.log ('Server is ready')
