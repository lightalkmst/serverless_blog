import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const max_posts = 3

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
  } = sources

  const posts$ =
    HTTP.select ('get_featured').flatten ()
      .map (HTTP_resp)
      // .map (A.sort (x => y => new Date (y.timestamp) - new Date (x.timestamp)))

  const post_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#featured #panel_${i} div`).events ('click').mapTo (i)
    ) (A.range (0) (max_posts - 1)))

  return {
    // TODO: everything
    DOM: (
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
      ))
        .startWith (<div />)
    ),
    HTTP: (
      navigation$.filter (F['='] ('archive'))
        .mapTo (http_requests.get_featured ({}) ())
    ),
    post_id$: (
      xs.combine (...[
        post_select$,
        featured_posts$,
      ])
        .map (([i, posts]) => posts[i].id)
    ),
    navigation$: post_select$.mapTo ('article'),
  }
}
