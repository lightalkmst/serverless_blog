import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import logout from './logout'

export default sources => {
  const {
    DOM,
    HTTP,
    auth$,
  } = sources

  const {
    DOM: logout_dom$,
    HTTP: logout_http$,
  } = logout (sources)

  return {
    DOM: (
      xs.combine (...[
        logout_dom$,
      ])
        .map (([
          logout_dom
        ]) => (
          <div id='profile' className=''>
            {logout_dom}
          </div>
      ))
    ),
    HTTP: (
      xs.merge (...[
        logout_http$,
      ])
    ),
  }
}
