import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import readable from '../common/readable/readable'

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

  const posts$ =
    HTTP.select ('get_posts').flatten ()
      .map (HTTP_resp)
      // reverse chronological order
      .map (A.sort (x => y => new Date (x.timestamp) - new Date (y.timestamp)))

  const post_select$ =
    DOM.select (`#archive div`).events ('click')
      .map (D.get ('target'))
      .map (D.get ('id'))
      .map (S.match (/archive_(.*)/))
      .map (A.get (1))

  const post_id$ =
    post_select$.compose (sampleCombine (posts$))
      .map (([i, posts]) => posts[i].id)

  const post_options = {type: 'post'}

  const {
    DOM: post_dom$,
    HTTP: post_http$,
  } = readable (post_options) ({
    ...sources,
    item_id$: post_id$,
    user_id$,
  })

  return {
    DOM: (
      xs.merge (...[
        posts$.map (posts => (
          <div id='archive' className='padded'>
            {
              A.mapi (i => post => (
                <div id={`archive_${i}`} className='bordered'>
                  {`${short_time_string (post.created)} : ${post.title}`}
                </div>
              )) (posts)
            }
          </div>
        )),
        post_dom$.map (post_dom => (
          <div id='archive' className='padded'>
            {post_dom}
          </div>
        )),
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.filter (F['='] ('archive'))
          .mapTo (http_requests.get_posts ({}) ()),
        post_http$,
      ])
    ),
  }
}
