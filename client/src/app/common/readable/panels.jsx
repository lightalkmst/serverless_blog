import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../../init'

import http_requests from '../http_requests'
// import item from '../item/item'

export default options => sources => {
  const {
    type,
    fields, // (string * (? -> dom)) array
    max_items,
  } = options

  const {
    DOM,
    HTTP,
    items$,
  } = sources

  const item_select$ =
    xs.merge (...A.map (i =>
      DOM.select (`#${type}_${i}`).events ('click').mapTo (i)
    ) (A.range (0) (max_items - 1)))
      .map (F.tap (F.log))

  const item_id$ =
    item_select$.compose (sampleCombine (items$))
      .map (([i, items]) => items[i].id)
      .map (F.tap (F.log))

  return {
    DOM: (
      items$.map (items => (
        <div id={`${type}s`} className='panel_grid'>
          {
            A.mapi (i => item =>
              i < max_items && (
                <div id={`${type}_${i}`} className='panel'>
                  <div className=''>
                    <div className='title'>
                      <h1>{item.title}</h1>
                    </div>
                    <div className='info'>
                      {
                        item.published
                        ? `Posted: ${time_string (item.created)}`
                        : `This item has not been published yet`
                      }
                      {item.updated && `Updated: ${time_string (item.updated)}`}
                      <br />
                      {`Tags: ${item.tags}`}
                    </div>
                    <div className='summary'>{item.summary}</div>
                  </div>
                </div>
              )
            ) (items)
          }
        </div>
      ))
    ),
    item_id$,
  }
}