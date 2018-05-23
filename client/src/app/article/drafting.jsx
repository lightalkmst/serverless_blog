import xs from 'xstream'

import init from '../../init'

import http_requests from '../common/http_requests'

// TODO: figure out how to import xstream extra methods
export default sources => {
  const {
    DOM,
    HTTP,
    post$,
    post_id$,
  } = sources

  const post_on_click = btn => published =>
    xs.combine (...[
      post_id$,
      DOM.select (`#draft_${btn}`).events ('click'),
      ...A.map (x => DOM.select (`#draft_${x}`).events ('input')) ([
        'title',
        'tags',
        'summary',
        'article',
      ])
    ])
      .map (([id, ev, title, tags, summary, article]) =>
        [id, ev, {
          title: title.target.value,
          tags: tags.target.value,
          summary: summary.target.value,
          article: article.target.value,
        }]
      )
      // [last click event, send request, post id, article details]
      .fold ((a, h) => [h[1], a[0] !== h[1], h[0], h[2]], [null, false, 0, {}])
      .filter (A.get (1))
      .map (([,, id, body]) => http_requests.post_post () ({...body, published}))

  return {
    DOM: (
      post$.startWith ({})
        .map (post =>
          <div className='draft'>
            {/* fading saved notice */}
            {'Title: '}
            <br />
            <input id='draft_title'></input>
            <br />
            {'Tags: '}
            <br />
            <input id='draft_tags'></input>
            <br />
            {'Summary: '}
            <br />
            <textarea id='draft_summary'></textarea>
            <br />
            {'Article: '}
            <br />
            <textarea id='draft_article'></textarea>
            {/* publish and delete buttons */}
            <button id='draft_delete' className='left'>Delete</button>
            <button id='draft_save' className='right'>Save</button>
            <button id='draft_publish' className='right'>Publish</button>
          </div>
      )
    ),
    HTTP: (
      xs.merge (...[
        post_on_click ('save') (false),
        post_on_click ('publish') (true),
        // // delete
        // xs.combine (...[
        //   post_id$,
        //   DOM.select ('#draft_delete').events ('click'),
        // ])
        //   // [last click event, send request, post id]
        //   .fold ((a, h) => [h[1], a[0] == h[1], h[0]], [null, false, 0])
        //   .filter (A.get (1))
        //   .map (([,, id]) => http_requests.del_post ({id}) ()),
      ])
    ),
  }
}
