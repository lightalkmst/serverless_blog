import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'

export default sources => {
  const {DOM, HTTP} = sources

  return {
    DOM: (
      xs.of (
        <div id='login' className='padded'>
          <div className='panel'>
            <div className=''>
              <div className='title'>
                <h1>Login</h1>
              </div>
              <div className='center'>
                <input id='login_email' placeholder='Email'></input>
                <br />
                <input id='login_pass' placeholder='Password'></input>
                <br />
                <button id='login_send'>Login</button>
              </div>
            </div>
          </div>
          <br />
          <div className='panel'>
            <div>
              <div className='title'>
                <h1>{'Create an account'}</h1>
              </div>
              <div className='center'>
                {'Password restrictions and stuff'}
                <br />
                <input id='create_email' placeholder='Email'></input>
                <br />
                <input id='create_pass' placeholder='Password'></input>
                <br />
                <input id='create_user' placeholder='Username'></input>
                <br />
                <button id='create_send'>Create</button>
              </div>
            </div>
          </div>
        </div>
      )
    ),
    HTTP: (
      xs.merge (...[
        DOM.select ('#login_send').events ('click')
          .compose (sampleCombine (
            xs.combine (
              ...A.map (x =>
                DOM.select (x).events ('input')
                  .map (x => x.target.value)
              ) (['#login_email', '#login_pass'])
            )
        ))
          .map (A.get (1))
          .map (([email, pass]) => http_requests.post_login () ({email, pass})),
        DOM.select ('#create_send').events ('click')
          .compose (sampleCombine (
            xs.combine (
              ...A.map (x =>
                DOM.select (x).events ('input')
                  .map (x => x.target.value)
              ) (['#create_email', '#create_pass', '#create_user'])
            )
        ))
          .map (A.get (1))
          .map (([email, pass, user]) => http_requests.post_account () ({email, pass, user})),
      ])
    ),
  }
}
