import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import article from '../common/article/article'

const max_posts = 3

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
  } = sources

  const featured_posts$ =
    HTTP.select ('get_featured').flatten ()
      .map (HTTP_resp)

  const post_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#featured #panel_${i} div`).events ('click').mapTo (i)
    ) (A.range (0) (max_posts - 1)))

  const post_id$ =
    post_select$.compose (sampleCombine (featured_posts$))
      .map (([i, posts]) => posts[i].id)

  const {
    DOM: article_dom$,
    HTTP: article_http$,
  } = article ({
    ...sources,
    post_id$,
  })

  return {
    // TODO: everything
    DOM: (
      xs.merge (...[
        featured_posts$.map (featured_posts => (
          <div id='home' className='home padded'>
            <div id='featured' className='featured_grid'>
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
                ) (featured_posts)
              }
            </div>
          </div>
        )),
        article_dom$,
      ])
    ),
    HTTP: (
      xs.merge (...[
        navigation$.filter (F['='] ('home'))
          .mapTo (http_requests.get_featured ({}) ()),
        article_http$,
      ])
    ),
  }
}
