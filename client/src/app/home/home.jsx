import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import panels from '../common/readable/panels'
import readable from '../common/readable/readable'
import loading from '../common/loading/loading'

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
    roles$,
  } = sources

  const announcement_options = {
    type: 'announcement',
    max_items: 1,
    columns: 1,
  }

  const {
    DOM: announcement_panel_dom$,
    item_id$: announcement_id$,
  } = panels (announcement_options) ({
    ...sources,
    items$: (
      HTTP.select ('get_announcements').flatten ()
        .map (HTTP_resp)
    ),
  })

  const {
    DOM: announcement_dom$,
    HTTP: announcement_http$,
  } = readable (announcement_options) ({
    ...sources,
    item_id$: xs.merge (...[
      announcement_id$,
      DOM.select ('#create_announcement').events ('click')
        .mapTo (0),
    ]),
  })

  const post_options = {
    type: 'post',
    max_items: 3,
    columns: 3,
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
    item_id$: xs.merge (...[
      post_id$,
      DOM.select ('#create_post').events ('click')
        .mapTo (0),
    ]),
  })

  const {DOM: loading_dom$} = loading (sources)

  return {
    DOM: (
      xs.merge (...[
        xs.combine (...[
          announcement_panel_dom$,
          post_panels_dom$,
          roles$,
        ])
          .map (([
            announcement_panel_dom,
            post_panels_dom,
            roles,
          ]) => (
            <div id='home' className='padded'>
              <h1 className='text_title text_hover'>Latest Announcement</h1>
              <br />
              {A.contains ('admin') (roles) && [
                <div className='right'>
                  <button id='create_announcement'>Announce</button>
                </div>,
                <br />,
              ]}
              {announcement_panel_dom}
              <br />
              <h1 className='text_title text_hover'>Featured Posts</h1>
              <br />
              {A.contains ('admin') (roles) && [
                <div className='right'>
                  <button id='create_post'>Post</button>
                </div>,
                <br />,
              ]}
              {post_panels_dom}
            </div>
        )),
        xs.merge (...[
          announcement_dom$,
          post_dom$,
        ])
          .map (item_dom => (
            <div id='home' className='padded'>
              {item_dom}
            </div>
        )),
        loading_dom$,
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.mapTo (http_requests.get_announcements ({}) ()),
        // cycle bug? doesn't run initial page load request if not included
        navigation$.filter (F.const (true))
          .mapTo (http_requests.get_featured ({}) ()),
        announcement_http$,
        post_http$,
      ])
    ),
  }
}
