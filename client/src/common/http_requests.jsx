import init from '../init'

// import cfg from '../../config'

// const base_url = cfg.base_url

const get = path => category => () => ({
  // url: `${base_url}${path}`,
  url: path,
  category,
  method: 'GET',
})

const post = path => category => send => ({
  // url: `${base_url}${path}`,
  url: path,
  category,
  method: 'POST',
  send,
})

export default {
  get_services: get ('') ('get_services'),
  get_features: get ('') ('get_features'),
  add_service: post ('') ('add_service'),
  add_feature: post ('') ('add_feature'),
}
