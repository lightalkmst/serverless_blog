import isolate from '@cycle/isolate'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../../init'

import http_requests from '../http_requests'

const item_to_dom = item => {
  return (
    F.p (item) (
      S.split (/\n+/)
      >> A.fold (a => h => [...a, <br />, h]) ([])
      >> A.tail
      >> A.filter (F.id)
      >> A.map (h =>
        typeof h == 'string'
        ? <div className='text_hover'>{h}</div>
        : h
      )
    )
  )
}

export default options => isolate (sources => {
  const {
    type,
    fields, // (string * (? -> dom)) array
  } = options

  const {
    DOM,
    HTTP,
    item$,
    item_id$,
    user_id$,
    roles$,
  } = sources

  return {
    DOM: (
      xs.combine (...[
        item$.filter (F.neg (F['='] ({}))),
        user_id$,
        roles$,
      ])
        .map (([
          item,
          user_id,
          roles,
        ]) => (
          <div id='' className=''>
            <div className='right'>
              {
                type == 'post' && A.contains ('admin') (roles) && A.map (i =>
                  <button id={`set_featured_${i}`}>
                    {`Set Featured ${i + 1}`}
                  </button>
                ) (A.range (0) (2))
              }
              {(type == 'post' && A.contains ('admin') (roles) || user_id == item.user_id) && <br />}
              {
                user_id == item.user_id
                && (
                  <button id={`${type}_edit`}>
                    Edit
                  </button>
                )
              }
            </div>
            <div className={'text_title text_hover'}>
              {item.title}
            </div>
            <div className={'text_data text_hover'}>
              {`Written by ${item.user_id} on ${time_string (item.created)}`}
              {item.updated && `Last updated on ${time_string (item.updated)}`}
              {`Tags: ${item.tags}`}
            </div>
            <br />
            <div className={'text_body'}>
              {item_to_dom (item.body)}
            </div>
          </div>
      ))
    ),
    HTTP: (
      xs.merge (...[
        item_id$.filter (F.id)
          .map (id => http_requests[`get_${type}`] ({id}) ()),
        // setting as featured is only available for posts
        ...(
          type == 'post'
          ? (
            A.map (i =>
              DOM.select (`#set_featured_${i}`).events ('click').mapTo (i)
                .compose(sampleCombine(item_id$))
                .map (([id, item_id]) => http_requests.post_featured () ({id, post_id: item_id}))
            ) (A.range (0) (2))
          )
          : []
        )
      ])
    ),
    editing$: (
      xs.merge (...[
        item$.mapTo (false),
        DOM.select (`#${type}_edit`).events ('click')
          .mapTo (true)
      ])
    ),
  }
})
