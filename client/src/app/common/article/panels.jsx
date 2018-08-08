import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../../init'

import http_requests from '../http_requests'
import article from '../article/article'

const max_posts = 3

export default sources => {
  const {
    DOM,
    HTTP,
    posts$,
  } = sources

  const post_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#post_${i} div`).events ('click').mapTo (i)
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
  })

  return {
    DOM: (
      posts$.map (posts => (
        <div id='posts' className='panel_grid'>
          {
            A.mapi (i => post =>
              i < max_posts && (
                <div id={`post_${i}`} className='panel'>
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
      ))
    ),
    post_id$,
  }
}
