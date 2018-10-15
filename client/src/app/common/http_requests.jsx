import init from '../../init'

// import cfg from '../../config'

// const base_url = cfg.base_url

const http = method => path => category => query => send => ({
  // url: `${base_url}${path}`,
  url: path,
  method,
  category,
  query,
  send,
  withCredentials: true,
})

const [get, post, del] = A.map (http) (['GET', 'POST', 'DELETE'])

export default {
  get_announcements: get ('announcements') ('get_announcements'),

  get_announcement: get ('announcement') ('get_announcement'),
  del_announcement: del ('announcement') ('del_announcement'),
  post_announcement: post ('announcement') ('post_announcement'),

  get_posts: get ('posts') ('get_posts'),

  get_post: get ('post') ('get_post'),
  del_post: del ('post') ('del_post'),
  post_post: post ('post') ('post_post'),

  get_featured: get ('featured') ('get_featured'),
  post_featured: post ('featured') ('post_featured'),

  post_account: post ('account') ('post_account'),

  post_login: post ('login') ('post_login'),

  post_logout: post ('logout') ('post_logout'),

  get_users: get ('users') ('get_users'),

  get_user: get ('user') ('get_user'),
}
