import xs from 'xstream'
import delay from 'xstream/extra/delay'
import sampleCombine from 'xstream/extra/sampleCombine'

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
    DOM.select (`#draft_${btn}`).events ('click')
      .compose (sampleCombine (
        xs.combine (...[
          post_id$,
          ...A.map (x => DOM.select (`#draft_${x}`).events ('input')) ([
            'title',
            'tags',
            'summary',
            'article',
          ])
        ])
      ))
      .map (A.get (1))
      .map (([id, title, tags, summary, article]) => ({
        id,
        title: title.target.value,
        tags: tags.target.value,
        summary: summary.target.value,
        article: article.target.value,
      }))
      .map ((body) => http_requests.post_post () ({...body, published}))

  return {
    DOM: (
      xs.combine (...[
        post$.startWith ({}),
        xs.merge (...[
          // assume post was just a save since they'd be sent to the published view otherwise
          HTTP.select ('post_post').flatten ().mapTo ([true, false]),
          HTTP.select ('del_post').flatten ().mapTo ([false, true]),
          xs.merge (...[
            HTTP.select ('post_post').flatten (),
            HTTP.select ('del_post').flatten (),
          ])
            .mapTo ([false, false])
            .compose (delay (3000))
        ])
          .startWith ([false, false]),
      ])
        .map (([post, [saved, deleted]]) =>
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
            {saved && <div>Successfully saved</div>}
            {deleted && <div>Successfully deleted</div>}
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
        // delete
        DOM.select ('#draft_delete').events ('click')
          .compose (sampleCombine (post_id$))
          .map (A.get (1))
          .filter (F.id)
          .map (id => http_requests.del_post ({id}) ()),
      ])
    ),
  }
}
