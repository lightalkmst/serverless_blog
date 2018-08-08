import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import article from '../common/article/article'
import article_panels from '../common/article/panels'

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

  const {
    DOM: article_panels_dom$,
    post_id$,
  } = article_panels ({
    ...sources,
    posts$,
  })

  const {
    DOM: article_dom$,
    HTTP: article_http$,
  } = article ({
    ...sources,
    post_id$,
  })

  return {
  DOM: (
    xs.merge (...[
      article_panels_dom$,
      article_dom$,
    ])
      .map (articles_dom => (
        <div id='home' className='padded'>
          {articles_dom}
        </div>
      ))
  ),
    HTTP: (
      navigation$.filter (F['='] ('recent'))
        .mapTo (http_requests.get_posts ({}) ())
    ),
  }
}
