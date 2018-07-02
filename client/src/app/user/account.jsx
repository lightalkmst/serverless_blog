import xs from 'xstream'

import init from '../../init'

import login from './login'
import profile from './profile'

export default sources => {
  const {DOM, HTTP} = sources

  const auth$ =
    HTTP.select ().flatten ()
      .map (HTTP_auth)

  const {
    DOM: login_dom$,
    HTTP: login_http$,
  } = login (sources)

  const {
    DOM: profile_dom$,
    HTTP: profile_http$,
  } = profile (sources)

  return {
    DOM: (
      xs.combine (...[
        auth$,
        login_dom$,
        profile_dom$,
      ])
        .map (([
          authorized,
          login_dom,
          profile_dom,
        ]) => (
          <div id='account' className='account'>
            {
              authorized
              ? profile_dom
              : login_dom
            }
          </div>
      ))
    ),
    HTTP: (
      xs.merge (...[
        login_http$,
        profile_http$,
      ])
    ),
  }
}
