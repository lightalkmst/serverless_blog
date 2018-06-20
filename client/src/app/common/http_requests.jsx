import init from '../../init'

// import cfg from '../../config'

// const base_url = cfg.base_url

const get = path => category => query => () => ({
  // url: `${base_url}${path}`,
  url: path,
  category,
  method: 'GET',
  query,
})

const post = path => category => query => send => ({
  // url: `${base_url}${path}`,
  url: path,
  category,
  method: 'POST',
  query,
  send,
})

const del = path => category => query => () => ({
  // url: `${base_url}${path}`,
  url: path,
  category,
  method: 'DELETE',
  query,
})

export default {
  get_posts: get ('posts') ('get_posts'),

  get_post: get ('post') ('get_post'),
  del_post: del ('post') ('del_post'),
  post_post: post ('post') ('post_post'),

  post_login: post ('login') ('post_login'),

  post_account: post ('account') ('post_account'),
}
