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
  } = sources

  const post$ =
    xs.merge (...[
      HTTP.select ('get_post').flatten ()
        .map (res => res.body),
      post_id$.filter (F.neg (F.id))
        .mapTo ({}),
    ])

  const {
    DOM: drafting_dom$,
    HTTP: drafting_http$,
  } = drafting ({
    ...sources,
    post$,
  })

  const {
    DOM: published_dom$,
    HTTP: published_http$,
  } = published ({
    ...sources,
    post$,
  })

  return {
    DOM: (
      xs.combine (...[
        post$,
        drafting_dom$,
        published_dom$,
      ])
        .map (([post, drafting_dom, published_dom]) =>
          post.published
          ? published_dom
          : drafting_dom
      )
        .startWith (null)
    ),
    HTTP: (
      xs.merge (...[
        // drafting_http$,
        published_http$,
      ])
    ),
  }
}
