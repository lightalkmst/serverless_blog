import xs from 'xstream'

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

export default options => sources => {
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
  } = sources

  return {
    DOM: (
      xs.combine (...[
        item$,
        user_id$,
      ])
        .map (([
          item,
          user_id,
        ]) => (
          <div id='' className=''>
            {user_id == item.user_id && <button id={`${type}_edit`}>Edit</button>}
            <div className={'text_title text_hover'}>
              {item.title}
            </div>
            <div className={'text_data text_hover'}>
              {`Written by ${item.user_id} on ${time_string (item.created)}`}
              {item.updated && `Last updated on ${time_string (item.updated)}`}
            </div>
            <br />
            <div className={'text_body'}>
              {item_to_dom (item.body)}
            </div>
          </div>
      ))
    ),
    HTTP: (
      item_id$.filter (F.id)
        .map (id => http_requests[`get_${type}`] ({id}) ())
    ),
    editing$: (
      xs.merge (...[
        item$.mapTo (false),
        DOM.select (`#${type}_edit`).events ('click')
          .mapTo (true)
      ])
    ),
  }
}
