import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import article from '../common/article/article'

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

  const post_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#recent #panel_${i}`).events ('click').mapTo (i)
    ) (A.range (0) (max_posts - 1)))

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
          <div id='recent' className='recent_grid padded'>
            {
              A.mapi (i => post =>
                i < max_posts && (
                  <div id={`panel_${i}`} className='panel'>
                    <div className=''>
                      <div className='title'>
                        <h1>{post.title}</h1>
                      </div>
                      <div className='info'>
                        {
                          post.published
                          ? `Posted: ${time_string (post.created)}`
                          : `This article has not been published yet`
                        }
                        {post.updated && `Updated: ${time_string (post.updated)}`}
                        <br />
                        {`Tags: ${post.tags}`}
                      </div>
                      <div className='summary'>{post.summary}</div>
                    </div>
                  </div>
                )
              ) (posts)
            }
          </div>
        )),
        article_dom$,
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.filter (F['='] ('recent'))
          .mapTo (http_requests.get_posts ({}) ()),
        article_http$,
      ])
    ),
  }
}
