import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import panels from '../common/readable/panels'
import readable from '../common/readable/readable'

const max_posts = 15

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

  const post_options = {
    type: 'post',
    max_items: 15,
  }

  const {
    DOM: post_panels_dom$,
    item_id$: post_id$,
  } = panels (post_options) ({
    ...sources,
    items$: (
      HTTP.select ('get_posts').flatten ()
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
      post_panels_dom$,
      post_dom$,
    ])
      .map (posts_dom => (
        <div id='home' className='padded'>
          {posts_dom}
        </div>
      ))
  ),
    HTTP: (
      navigation$.filter (F['='] ('recent'))
        .mapTo (http_requests.get_posts ({}) ())
    ),
  }
}
