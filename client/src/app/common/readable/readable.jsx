import isolate from '@cycle/isolate'
import xs from 'xstream'

import init from '../../../init'

import http_requests from '../http_requests'
import published from './published'
import drafting from './drafting'

export default options => isolate (sources => {
  const {type} = options

  const {
    DOM,
    HTTP,
    item_id$,
    user_id$,
  } = sources

  const item$ =
    xs.merge (...[
      xs.merge (...A.map (x => HTTP.select (x).flatten ()) ([
        `get_${type}`,
        `post_${type}`,
        `del_${type}`,
      ]))
        .map (HTTP_resp)
        .map (A.get (0)),
      item_id$.filter (F.neg (F.id))
        .mapTo ({}),
    ])

  const {
    DOM: drafting_dom$,
    HTTP: drafting_http$,
  } = drafting (options) ({
    ...sources,
    item$,
    item_id$: (
      xs.merge (...[
        item$.map (D.get ('id')),
        item_id$,
      ])
    ),
  })

  const {
    DOM: published_dom$,
    HTTP: published_http$,
    editing$,
  } = published (options) ({
    ...sources,
    item$,
  })

  return {
    DOM: (
      xs.combine (...[
        item$,
        editing$,
        drafting_dom$.startWith (null),
        published_dom$.startWith (null),
      ])
        .map (([item, editing, drafting_dom, published_dom]) => (
          <div id='item' className=''>
            {
              item.published && !editing
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
})
