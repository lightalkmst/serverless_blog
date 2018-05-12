import xs from 'xstream'

import init from '../init'

import http_requests from './http_requests'

export default adder => fields => sources => {
  const {DOM, HTTP} = sources

  return {
    DOM: (
      xs.merge (...[
        DOM.select (`#${adder.id}_adder_tab`).events ('click'),
        DOM.select (`#${adder.id}_adder_submit`).events ('click'),
      ])
        .startWith (null)
        // clear out old inputs
        .map (F.tap (() => A.iter (({id}) => (document.getElementById (`${adder.id}_adder_${id}`) || {}).value = '') (fields)))
        .map (() => (
          <div>
            {
              A.map (({label, id}) => [
                `${label}: `,
                <input id={`${adder.id}_adder_${id}`}></input>,
                <br />,
              ]) (fields)
            }
            <button id={`${adder.id}_adder_submit`}>{`Add ${adder.label}`}</button>
          </div>
      ))
    ),
    HTTP: (
      xs.merge (...[
        // submit
        xs.merge (...[
          // [request, send request, clear request]
          DOM.select (`#${adder.id}_adder_tab`).events ('click')
            .mapTo ([{}, false, true]),
          DOM.select (`#${adder.id}_adder_submit`).events ('click')
            .mapTo ([{}, true, false]),
          xs.merge (...A.map (({id}) => DOM.select (`#${adder.id}_adder_${id}`).events ('input')) (fields))
            // strip the id down to the field name
            .map (x => [({[S.replace (`${adder.id}_adder_`) ('') (x.target.id)]: x.target.value}), false, false]),
        ])
          .fold (([req, submitted], [prop, submit, tabbed]) => [D.extend (submitted || tabbed ? {} : req) (prop), submit], [{}, false])
          .map (x => x[1] && ! D.is_empty (x[0]) ? http_requests[`add_${adder.id}`] (x[0]) : {}),
        // refresh client data
        HTTP.select (`add_${adder.id}`).flatten ()
          .map (() => http_requests[`get_${adder.id}s`] ()),
      ])
    ),
  }
}
