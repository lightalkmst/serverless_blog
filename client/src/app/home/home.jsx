import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

const create_panel = panel =>
  <div className='panel'>
    <div>
      <div className='title'>
        <h1>{panel.title}</h1>
      </div>
      <div className='subject'>{panel.subject}</div>
    </div>
  </div>

export default sources => {
  const {
    DOM,
    HTTP,
    nav_state$,
  } = sources

  // get post summaries
  // render summary panels
  // send ids upstream for processing too

  return {
    DOM: (
      HTTP.select ('get_posts')
        .map (A.map (create_panel))
        .startWith ([create_panel ({title: 'Test', subject: 'Test test test'})])
    ),
    HTTP: (
      nav_state$.filter (F['='] ('home'))
        .startWith ('home')
        .mapTo (http_requests.get_posts)
    ),
  }
}
