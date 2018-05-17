import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const max_posts = 12

export default sources => {
  const {
    DOM,
    HTTP,
    nav_state$,
  } = sources

  // get post summaries
  // render summary panels
  // send ids upstream for processing too

  var posts$ =
    HTTP.select ('get_posts').flatten ()
      .map (res => res.body)
      .map (A.sort (x => y => new Date (y.timestamp) - new Date (x.timestamp)))

  return {
    DOM: (
      posts$.startWith ([{title: 'Test', summary: 'Test test test'}])
        .map (posts => (
          <div className='home_grid'>
            {
              A.mapi (i => panel =>
                <div id={`panel_${i}`} className='panel'>
                  <div>
                    <div className='title'>
                      <h1>{panel.title}</h1>
                    </div>
                    <div className='summary'>{panel.summary}</div>
                  </div>
                </div>
              ) (posts)
            }
          </div>
      ))
    ),
    HTTP: (
      nav_state$.filter (F['='] ('home'))
        .startWith ('home')
        .map (http_requests.get_posts)
    ),
    post_id_state$: (
      xs.combine (...[
        xs.merge (...A.map (i =>
          DOM.select (`#panel_${i}`).events ('click').mapTo (i)
        ) (A.range (0) (max_posts - 1)))
        .map (F.tap (F.log)),
        // DOM.select ('.panel').events ('click').map (e => e.target.id)
        // .map (F.tap (F.log)),
        posts$,
      ])
        .map (F.tap (F.log))
        .map (([i, posts]) => posts[i].id)
        .map (F.tap (F.log))
    ),
  }
}
