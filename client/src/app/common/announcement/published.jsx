import xs from 'xstream'

import init from '../../../init'

import http_requests from '../http_requests'

const post_to_dom = post => {
  return (
    F.p (post) (
      S.split (/\n+/)
      >> A.fold (a => h => [...a, <br />, h]) ([])
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
    post$,
    post_id$,
    user_id$,
  } = sources

  return {
    DOM: (
      xs.combine (...[
        post$,
        user_id$,
      ])
        .map (([
          post,
          user_id,
        ]) => (
          <div id='' className=''>
            {user_id == post.user_id && <button id='article_edit'>Edit</button>}
            <div className='article_title text_hover'>
              {post.title}
            </div>
            <div className='article_data text_hover'>
              {`Written by ${post.user_id} on ${time_string (post.created)}`}
              {post.updated && `Last updated on ${time_string (post.updated)}`}
            </div>
            <br />
            <div className='article_body'>
              {post_to_dom (post.post)}
            </div>
          </div>
      ))
    ),
    HTTP: (
      post_id$.filter (F.id)
        .map (id => http_requests.get_post ({id}) ())
    ),
    editing$: (
      xs.merge (...[
        post$.mapTo (false),
        DOM.select ('#article_edit').events ('click')
          .mapTo (true)
      ])
    ),
  }
}
