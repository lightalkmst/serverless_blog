import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'

export default sources => {
  const {DOM, HTTP} = sources

  return {
    DOM: (
      xs.of (
        <div id='logout' className='padded'>
          <div className='panel'>
            <div className=''>
              <div className='title'>
                <h1>{'Logout'}</h1>
              </div>
              <div className='center half-padded'>
                <button id='logout_send'>{'Logout'}</button>
              </div>
            </div>
          </div>
        </div>
      )
    ),
    HTTP: (
      DOM.select ('#logout_send').events ('click')
        .mapTo (http_requests.post_logout () ())
    ),
  }
}
