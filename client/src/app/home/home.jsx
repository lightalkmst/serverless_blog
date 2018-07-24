import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

import http_requests from '../common/http_requests'
import home_admin from './home_admin'
import home_user from './home_user'

export default sources => {
  const {
    DOM,
    HTTP,
    roles$,
  } = sources

  const {
    DOM: home_admin_dom$,
    HTTP: home_admin_http$,
  } = home_admin (sources)

  const {
    DOM: home_user_dom$,
    HTTP: home_user_http$,
  } = home_user (sources)

  return {
    // TODO: everything
    DOM: (
      xs.combine (...[
        roles$,
        home_admin_dom$,
        home_user_dom$,
      ])
        .map (([
          roles,
          home_admin_dom,
          home_user_dom,
        ]) =>
          A.contains ('admin') (roles)
          ? home_admin_dom
          : home_user_dom
      )
    ),
    HTTP: (
      xs.merge (...[
        home_admin_http$,
        home_user_http$,
      ])
    ),
  }
}
