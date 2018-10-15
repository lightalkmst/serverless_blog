import xs from 'xstream'

import init from './init'

import account from './app/user/account'
import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import home from './app/home/home'
import newest from './app/newest/newest'
import archive from './app/archive/archive'
import about from './app/about/about'

export default sources => {
  const {DOM, HTTP} = sources

  const {
    DOM: nav_bar_dom$,
    navigation$: nav_bar_navigation$,
  } = nav_bar (sources)

  const {
    DOM: account_dom$,
    HTTP: account_http$,
    user_id$,
    navigation$: account_navigation$,
    roles$,
  } = account ({
    ...sources,
    navigation$: nav_bar_navigation$,
  })

  const navigation$ =
    xs.merge (
      account_navigation$,
      nav_bar_navigation$,
    )
      .startWith ('home')

  const {
    DOM: header_dom$,
  } = header (sources)

  const {
    DOM: home_dom$,
    HTTP: home_http$,
  } = home ({
    ...sources,
    navigation$: navigation$.filter (F['=='] ('home')),
    user_id$,
    roles$,
  })

  const {
    DOM: newest_dom$,
    HTTP: newest_http$,
  } = newest ({
    ...sources,
    navigation$: navigation$.filter (F['=='] ('newest')),
    user_id$,
    roles$,
  })

  const {
    DOM: archive_dom$,
    HTTP: archive_http$,
  } = archive ({
    ...sources,
    navigation$: navigation$.filter (F['=='] ('archive')),
    user_id$,
    roles$,
  })

  const {DOM: about_dom$} = about ({
    ...sources,
    navigation$: navigation$.filter (F['=='] ('about')),
  })

  return {
    DOM: (
      xs.combine (
        navigation$,
        nav_bar_dom$,
        header_dom$,
        home_dom$,
        newest_dom$.startWith (<div />),
        archive_dom$.startWith (<div />),
        account_dom$.startWith (<div />),
        about_dom$,
      )
        .map (([
          navigation,
          nav_bar_dom,
          header_dom,
          home_dom,
          newest_dom,
          archive_dom,
          account_dom,
          about_dom,
        ]) => {
          const selected_tab_dom = {
            home_dom,
            newest_dom,
            archive_dom,
            account_dom,
            about_dom,
          }[`${navigation}_dom`]

          return (
            <div>
              {nav_bar_dom}
              <div className='main'>
                {header_dom}
                <div className='content padded'>
                  {selected_tab_dom}
                </div>
              </div>
            </div>
          )
      })
    ),
    HTTP: (
      xs.merge (
        home_http$,
        newest_http$,
        archive_http$,
        account_http$,
      )
    ),
  }
}
