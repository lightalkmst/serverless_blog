import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

export default sources => {
  const {
    DOM,
    HTTP,
    post$,
  } = sources

  //   title TEXT,
  //   summary TEXT,
  //   tags TEXT,
  //   post TEXT,
  return {
    DOM: (
      post$.startWith ({})
        .map (post =>
          // <div>{'asdf'}</div>
          <div className='draft'>
            {'Title: '}
            <br />
            <input id='draft_title'></input>
            <br />
            {'Tags: '}
            <br />
            <input id='tags'></input>
            <br />
            {'Summary: '}
            <br />
            <textarea id='summary'></textarea>
            <br />
            {'Article: '}
            <br />
            <textarea id='article'></textarea>
          </div>
      )
    ),
    // HTTP: post_id$.map (id => http_requests.get_post ({id}) ()),
  }
}
