import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const max_posts = 12

export default sources => {
  const {
    DOM,
    HTTP,
    navigation$,
  } = sources

  // get post summaries
  // render summary panels
  // send ids upstream for processing too

  var posts$ =
    HTTP.select ('get_posts').flatten ()
      .map (res => res.body)
      .map (A.sort (x => y => new Date (y.timestamp) - new Date (x.timestamp)))

  var post_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#panel_${i}`).events ('click').mapTo (i)
    ) (A.range (0) (max_posts - 1)))

  return {
    DOM: (
      posts$.map (posts => (
        <div className='home_grid'>
          {
            A.mapi (i => post =>
              <div id={`panel_${i}`} className='panel'>
                <div>
                  <div className='title'>
                    <h1>{post.title}</h1>
                  </div>
                  <div className='tags'>{`Tags: ${post.tags}`}</div>
                  <div className='summary'>{post.summary}</div>
                </div>
              </div>
            ) (posts)
          }
        </div>
      ))
    ),
    HTTP: (
      navigation$.filter (F['='] ('home'))
        .startWith ('home')
        .map (http_requests.get_posts ({}))
    ),
    post_id$: (
      xs.combine (...[
        post_select$,
        posts$,
      ])
        .map (([i, posts]) => posts[i].id)
    ),
    post_select$,
  }
}
