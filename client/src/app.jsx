import xs from 'xstream'

import init from './init'

import account from './app/user/account'
import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import home from './app/home/home'
import recent from './app/recent/recent'
import archive from './app/archive/archive'
import article from './app/article/article'

export default sources => {
  const {DOM, HTTP} = sources

  const {
    DOM: account_dom$,
    HTTP: account_http$,
    user_id$,
    navigation$: account_navigation$,
  } = account (sources)

  const {
    DOM: nav_bar_dom$,
    navigation$: nav_bar_navigation$,
  } = nav_bar (sources)

  const navigation$ =
    xs.merge (...[
      account_navigation$,
      nav_bar_navigation$,
    ])
      .startWith ('home')

  // TODO: search bar
  const {
    DOM: header_dom$,
  } = header (sources)

  const {
    DOM: home_dom$,
    HTTP: home_http$,
  } = home ({
    ...sources,
    navigation$,
    user_id$,
  })

  const {
    DOM: recent_dom$,
    HTTP: recent_http$,
  } = recent ({
    ...sources,
    navigation$,
    user_id$,
  })

  const {
    DOM: archive_dom$,
    HTTP: archive_http$,
  } = archive ({
    ...sources,
    navigation$,
    user_id$,
  })

  return {
    DOM: (
      xs.combine (...[
        navigation$,
        nav_bar_dom$,
        header_dom$,
        home_dom$,
        recent_dom$.startWith (<div />),
        archive_dom$.startWith (<div />),
        account_dom$.startWith (<div />),
      ])
        .map (([
          navigation,
          nav_bar_dom,
          header_dom,
          home_dom,
          recent_dom,
          archive_dom,
          account_dom,
        ]) => {
          const selected_tab_dom = {
            home_dom,
            recent_dom,
            archive_dom,
            account_dom,
          }[`${navigation}_dom`]

          return (
            <div>
              {nav_bar_dom}
              <div className='main'>
                {header_dom}
                <div className='content'>
                  {selected_tab_dom}
                </div>
              </div>
            </div>
          )
      })
    ),
    HTTP: (
      xs.merge (...[
        home_http$,
        recent_http$,
        archive_http$,
        account_http$,
      ])
    ),
  }
}
