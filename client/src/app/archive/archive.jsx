import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import readable from '../common/readable/readable'
import loading from '../common/loading/loading'

const short_time_string = timestamp => {
  const date = new Date (timestamp)
  return `${date.getMonth () + 1}/${date.getDate ()}/${date.getFullYear ()}`
}

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
    user_id$,
  } = sources

  const [
    [announcements$, announcement_dom$, announcement_http$],
    [posts$, post_dom$, post_http$],
  ] =
    A.map (type => {
      const items$ =
        HTTP.select (`get_${type}s`).flatten ()
          .map (HTTP_resp)
          // reverse chronological
          .map (A.sort (x => y => new Date (y.updated) - new Date (x.updated)))

      const item_select$ =
        DOM.select (`#archive div`).events ('click')
          .map (D.get ('target'))
          .map (D.get ('id'))
          .map (S.match (/archive_(.*)_(.*)/))
          .filter (F.id)
          .filter (l => l[1] == type)
          .map (A.get (2))

      const item_id$ =
        item_select$.compose (sampleCombine (items$))
          .map (([i, items]) => items[i].id)

      const {
        DOM: item_dom$,
        HTTP: item_http$,
      } = readable ({type}) ({
        ...sources,
        item_id$,
        user_id$,
      })

      return [items$, item_dom$, item_http$]
    }) (['announcement', 'post'])

  const create_rows = type =>
    A.mapi (i => x => (
      <div id={`archive_${type}_${i}`} className='bordered'>
        {`${short_time_string (x.published || x.updated)} ${!x.published ? '<drafting> ' : ''}: ${x.title}`}
      </div>
    ))

  // TODO: search functionality

  const {DOM: loading_dom$} = loading (sources)

  return {
    DOM: (
      xs.merge (...[
        xs.combine (...[
          announcements$,
          posts$,
        ])
          .map (([
            announcements,
            posts,
          ]) => (
            <div id='archive' className='padded'>
              <h1 className='text_title text_hover'>Announcements</h1>
              <br />
              {create_rows ('announcement') (announcements)}
              <br />
              <h1 className='text_title text_hover'>Posts</h1>
              <br />
              {create_rows ('post') (posts)}
            </div>
          )),
        xs.merge (...[
          announcement_dom$,
          post_dom$,
        ])
          .map (text_dom => (
            <div id='archive' className='padded'>
              {text_dom}
            </div>
          )),
        loading_dom$,
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.mapTo (http_requests.get_posts ({}) ()),
        navigation$.mapTo (http_requests.get_announcements ({}) ()),
        announcement_http$,
        post_http$,
      ])
    ),
  }
}
