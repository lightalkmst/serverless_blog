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
var cookieParser = require ('cookie-parser')
app.use (cookieParser ())
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
//   summary TEXT,
//   timestamp TIMESTAMPTZ,
//   tags TEXT,
//   published BOOLEAN,
//   post TEXT,
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
var db = {
  users: [],
  posts: [],
  comments: [],
  messages: [],
}
var article = require ('./test_data/article')
db.posts = A.map (i => D.extend (article) ({
  id: i,
  title: `${article.title} ${i}`,
})) (A.range (1) (10))
var users_id = db.users.length + 1
var posts_id = db.posts.length + 1
var comments_id = db.comments.length + 1
var messages_id = db.messages.length + 1

// // get_posts
// get ('posts') ((req, res) => {
//   res.json (
//     F.p (db.posts) (
//       // TODO: add user check if not published
//       A.filter (post => post.published)
//     )
//   )
//     .end ()
// })

get ('post') ((req, res) => {
  res.json (A.find (x => x.id == req.query.id) (db.posts))
    .end ()
})

// Table: Posts
//   id PRIMARY KEY INTEGER,
//   user_id FOREIGN KEY INTEGER,
//   title TEXT,
//   summary TEXT,
//   timestamp TIMESTAMPTZ,
//   tags TEXT,
//   published BOOLEAN,
//   post TEXT,
post ('post') ((req, res) => {
  // TODO: overwriting by id
  var post = {
    ...req.body,
    id: posts_id++,
    // TODO: get from cookie
    user_id: 1,
    timestamp: `${new Date ()}`,
  }
  db = {...db, posts: [...db.posts, post]}
  res.json (post)
    .end ()
})

del ('post') ((req, res) => {
  db = {...db, posts: A.filter (x => x.id != req.query.id) (db.posts)}
  res.json ({})
    .end ()
})

// get ('id') ((req, res) => {
//   console.log (req.cookies)
//   res.json ({})
//     .end ()
// })

// TODO: reset db

// config hijack for local
// TODO: replace using config file to allow for remote config
const crud_cfg = require ('../serverless/src/common/config')
crud_cfg.user = 'postgres'
crud_cfg.host = 'localhost'
crud_cfg.database = 'blog'
crud_cfg.password = 'postgres'
crud_cfg.port = 5432
crud_cfg.rounds = 10
crud_cfg.local = true

// convert AWS lambdas to server controllers
const adapter = handler => async (req, res) => res.json ((await handler (req)).body)

A.iter (([method, path, f]) => method (path) (adapter (require (`../serverless/src/${f}`)))) ([
  [get, 'posts', 'get_posts'],
])

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

////////////////////
//                //
// SOFT RELOADING //
//                //
////////////////////

var exec = require ('child_process').exec

var stdin = process.openStdin ()

stdin.addListener ('data', () => {
  F.log ('Rebuilding the application')
  exec ('node scripts/build.js', () => F.log ('Rebuilding is complete'))
})

app.listen (cfg.port || 8080)
A.iter (F.log) ([
  'Server is ready',
  'Enter to rebuild the client at any time; server changes require a restart'
])
