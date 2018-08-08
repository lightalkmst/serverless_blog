import xs from 'xstream'

import init from '../../../init'

import http_requests from '../http_requests'
import published from './published'
import drafting from './drafting'

export default sources => {
  const {
    DOM,
    HTTP,
    announcement_id$,
    user_id$,
  } = sources

  const announcement$ =
    xs.merge (...[
      xs.merge (...A.map (x => HTTP.select (x).flatten ()) ([
        'get_announcement',
        'post_announcement',
        'del_announcement',
      ]))
        .map (HTTP_resp)
        .map (A.get (0)),
      announcement_id$.filter (F.neg (F.id))
        .mapTo ({}),
    ])

  const {
    DOM: drafting_dom$,
    HTTP: drafting_http$,
  } = drafting ({
    ...sources,
    announcement$,
    announcement_id$: (
      xs.merge (...[
        announcement_id$,
        HTTP.select ('post_announcement').flatten ()
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
    announcement$,
    user_id$,
  })

  return {
    DOM: (
      xs.combine (...[
        announcement$,
        editing$,
        drafting_dom$,
        published_dom$,
      ])
        .map (([announcement, editing, drafting_dom, published_dom]) => (
          <div id='article' className='padded'>
            {
              announcement.published && !editing
              ? published_dom
              : drafting_dom
            }
          </div>
      ))
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
