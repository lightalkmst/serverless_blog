import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const max_posts = 15

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
  } = sources

  var posts$ =
    HTTP.select ('get_posts').flatten ()
      .map (D.get ('body'))
      .map (A.sort (x => y => new Date (y.timestamp) - new Date (x.timestamp)))

  var post_select$ =
    xs.merge (...A.map (i =>
        DOM.select (`#panel_${i} div`).events ('click').mapTo (i)
    ) (A.range (0) (max_posts - 1)))

  return {
    DOM: (
      posts$.map (posts => (
        <div className=''>
          <div className='home_grid'>
            {
              A.mapi (i => post =>
                i < max_posts && (
                  <div id={`panel_${i}`} className='panel'>
                    <div>
                      <div className='title'>
                        <h1>{post.title}</h1>
                      </div>
                      <div className='info'>
                        {`Posted: ${post.timestamp}` /* TODO: format date time */}
                        <br />
                        {`Tags: ${post.tags}`}
                        {/* TODO: published note for super users for their own posts */}
                      </div>
                      <div className='summary'>{post.summary}</div>
                    </div>
                  </div>
                )
              ) (posts)
            }
          </div>
        </div>
      ))
    ),
    HTTP: (
      navigation$.filter (F['='] ('home'))
        .startWith ('home')
        .map (http_requests.get_posts ({}))
    ),
    post_id$: (
      xs.merge (...[
        xs.combine (...[
          post_select$,
          posts$,
        ])
          .map (([i, posts]) => posts[i].id),
        DOM.select ('#create').events ('click').mapTo (0),
      ])
    ),
    post_select$: post_select$.mapTo ('article'),
  }
}
