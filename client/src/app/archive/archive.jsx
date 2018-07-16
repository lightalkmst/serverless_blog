import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import article from '../article/article'

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
      .map (A.sort (x => y => new Date (y.timestamp) - new Date (x.timestamp)))

  const post_select$ =
    DOM.select (`#archive div`).events ('click')
      .map (D.get ('target'))
      .map (D.get ('id'))
      .map (S.match (/archive_(.*)/))
      .map (A.get (1))

  const post_id$ =
    post_select$.compose (sampleCombine (posts$))
      .map (([i, posts]) => posts[i].id)

  const {
    DOM: article_dom$,
    HTTP: article_http$,
  } = article ({
    ...sources,
    post_id$,
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
        article_dom$,
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.filter (F['='] ('archive'))
          .mapTo (http_requests.get_posts ({}) ()),
        article_http$,
      ])
    ),
  }
}
