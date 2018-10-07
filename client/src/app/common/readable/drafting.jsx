import isolate from '@cycle/isolate'
import xs from 'xstream'
import delay from 'xstream/extra/delay'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../../init'

import http_requests from '../http_requests'

export default options => isolate (sources => {
  const {type} = options

  const {
    DOM,
    HTTP,
    item$,
    item_id$,
  } = sources

  const post_on_click = btn => published =>
    DOM.select (`#draft_${btn}`).events ('click')
      .compose (sampleCombine (
        xs.combine (...[
          item_id$,
          ...A.map (x => DOM.select (`#draft_${x}`).events ('input')) ([
            'title',
            'tags',
            'summary',
            'body',
          ])
        ])
      ))
      .map (A.get (1))
      .map (([id, title, tags, summary, body]) => ({
        id,
        title: title.target.value,
        tags: tags.target.value,
        summary: summary.target.value,
        body: body.target.value,
      }))
      .map (body => http_requests[`post_${type}`] () ({...body, published}))

  return {
    DOM: (
      xs.combine (...[
        item$.startWith ({}),
        xs.merge (...[
          // assume post was just a save since they'd be sent to the published view otherwise
          HTTP.select (`post_${type}`).flatten ().mapTo ([true, false]),
          HTTP.select (`del_${type}`).flatten ().mapTo ([false, true]),
          xs.merge (...[
            HTTP.select (`post_${type}`).flatten (),
            HTTP.select (`del_${type}`).flatten (),
          ])
            .mapTo ([false, false])
            .compose (delay (3000))
        ])
          .startWith ([false, false]),
      ])
        .map (([item, [saved, deleted]]) =>
          <div id='' className='draft'>
            <h1 className='text_title text_hover'>{`New ${S.upper (type[0])}${S.substr (1) (-1) (type)}`}</h1>
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
            {'Body: '}
            <br />
            <textarea id='draft_body'></textarea>
            <div>
              {saved && 'Successfully saved'}
              {deleted && 'Successfully deleted'}
            </div>
            <div className='right'>
              <button id='draft_delete'>Delete</button>
              <button id='draft_save'>Save</button>
              <button id='draft_publish'>Publish</button>
            </div>
          </div>
      )
    ),
    HTTP: (
      xs.merge (...[
        post_on_click ('save') (false),
        post_on_click ('publish') (true),
        // delete
        DOM.select ('#draft_delete').events ('click')
          .compose (sampleCombine (item_id$))
          .map (A.get (1))
          .filter (F.id)
          .map (id => http_requests[`del_${type}`] ({id}) ()),
      ])
    ),
  }
})
