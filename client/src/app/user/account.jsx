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

  const user$ =
    xs.merge (
      ...A.map (x => HTTP.select (x).flatten ()) ([
        'post_account',
        'post_login',
      ])
    )
      .map (HTTP_resp)
      .filter (F.id)

  return {
    DOM: (
      xs.combine (
        auth$,
        login_dom$,
        profile_dom$,
      )
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
      xs.merge (
        login_http$,
        profile_http$,
      )
    ),
    user_id$: (
      xs.merge (
        user$.map (D.get ('id')),
        HTTP.select ('post_logout').flatten ()
          .mapTo (-1),
      )
        .startWith (-1)
    ),
    navigation$: (
      // redirect user to login if session times out
      HTTP.select ().flatten ()
        .map (D.get ('authenticated'))
        .fold ((a, h) => [h, a[0] && !h], [false, false])
        .map (A.get (1))
        .filter (F.id)
        .mapTo ('login')
    ),
    roles$: (
      xs.merge (
        user$.map (D.get ('roles'))
          .map (S.split (', ')),
        HTTP.select ('post_logout').flatten ()
          .mapTo ([]),
      )
        .startWith ([])
    ),
  }
}
