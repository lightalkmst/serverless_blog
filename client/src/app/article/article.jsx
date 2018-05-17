import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const post_to_dom = post => {

  return (
    F.p (post) (
      S.split (/\n+/)
      >> A.fold (a => h => [...a, <br />, h]) ([])
      >> A.tail
      >> A.tail
      >> A.filter (F.id)
      >> A.map (h =>
        typeof h == 'string'
        ? <div className='text_hover'>{h}</div>
        : h
      )
    )
  )
}

export default sources => {
  const {
    DOM,
    HTTP,
    post_id$,
  } = sources

  return {
    DOM: (
      HTTP.select ('get_post').flatten ()
        .map (res => res.body)
        .map (post => (
          <div className='post'>
            <div className='post_title text_hover'>
              {post.title}
            </div>
            <div className='post_data text_hover'>
              {`Written by ${post.user_id} on ${post.timestamp}`}
            </div>
            <div className='post_body'>
              {post_to_dom (post.post)}
            </div>
          </div>
      ))
        .startWith (null)
    ),
    HTTP: post_id$.map (id => http_requests.get_post ({id}) ()),
  }
}
