import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'
import published from './published'
import drafting from './drafting'

export default sources => {
  const {
    DOM,
    HTTP,
    post_id$,
    user_id$,
  } = sources

  const post$ =
    xs.merge (...[
      xs.merge (...A.map (x => HTTP.select (x).flatten ()) ([
        'get_post',
        'post_post',
        'del_post',
      ]))
        .map (HTTP_resp)
        .map (A.get (0)),
      post_id$.filter (F.neg (F.id))
        .mapTo ({}),
    ])

  const {
    DOM: drafting_dom$,
    HTTP: drafting_http$,
  } = drafting ({
    ...sources,
    post$,
    post_id$: (
      xs.merge (...[
        post_id$,
        HTTP.select ('post_post').flatten ()
          .map (D.get ('body'))
          .map (D.get ('id')),
      ])
    ),
  })

  const {
    DOM: published_dom$,
    HTTP: published_http$,
    editing$,
  } = published ({
    ...sources,
    post$,
    user_id$,
  })

  return {
    DOM: (
      xs.combine (...[
        post$,
        editing$,
        drafting_dom$,
        published_dom$,
      ])
        .map (([post, editing, drafting_dom, published_dom]) =>
          post.published && !editing
          ? published_dom
          : drafting_dom
      )
        .startWith (null)
    ),
    HTTP: (
      xs.merge (...[
        drafting_http$,
        published_http$,
      ])
    ),
  }
}
