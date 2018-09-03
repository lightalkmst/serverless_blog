import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import panels from '../common/readable/panels'
import readable from '../common/readable/readable'

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
  } = sources

  const announcement_options = {
    type: 'announcement',
    max_items: 1,
  }

  const {
    DOM: announcement_panel_dom$,
    item_id$: announcement_id$,
  } = panels (announcement_options) ({
    ...sources,
    items$: (
      HTTP.select ('get_announcements').flatten ()
        .map (HTTP_resp)
        // .map (announcements => [announcements[0]])
    ),
  })

  const {
    DOM: announcement_dom$,
    HTTP: announcement_http$,
  } = readable (announcement_options) ({
    ...sources,
    item_id$: announcement_id$,
  })

  const post_options = {
    type: 'post',
    max_items: 3,
  }

  const {
    DOM: post_panels_dom$,
    item_id$: post_id$,
  } = panels (post_options) ({
    ...sources,
    items$: (
      HTTP.select ('get_featured').flatten ()
        .map (HTTP_resp)
    ),
  })

  const {
    DOM: post_dom$,
    HTTP: post_http$,
  } = readable (post_options) ({
    ...sources,
    item_id$: post_id$,
  })

  return {
    DOM: (
      xs.merge (...[
        xs.combine (...[
          announcement_panel_dom$,
          post_panels_dom$,
        ])
          .map (([
            announcement_panel_dom,
            post_panels_dom,
          ]) => (
            <div id='home' className='padded'>
              {announcement_panel_dom}
              <br />
              {post_panels_dom}
            </div>
        )),
        announcement_dom$.map (announcement_dom => (
          <div id='home' className='padded'>
            {announcement_dom}
          </div>
        )),
        post_dom$.map (post_dom => (
          <div id='home' className='padded'>
            {post_dom}
          </div>
        )),
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.filter (F['='] ('home'))
          .mapTo (http_requests.get_announcements ({}) ()),
        navigation$.filter (F['='] ('home'))
          .mapTo (http_requests.get_featured ({}) ()),
        announcement_http$,
        post_http$,
      ])
    ),
  }
}
