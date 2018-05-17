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

export default {
  get_posts: get ('posts') ('get_posts'),
  get_post: get ('post') ('get_post'),

  get_services: get ('') ('get_services'),
  get_features: get ('') ('get_features'),
  add_service: post ('') ('add_service'),
  add_feature: post ('') ('add_feature'),
}