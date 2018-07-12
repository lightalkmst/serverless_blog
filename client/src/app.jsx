import xs from 'xstream'

import init from './init'

import account from './app/user/account'
import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import home from './app/home/home'
import recent from './app/recent/recent'
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

  // TODO: search bar
  const {
    DOM: header_dom$,
  } = header (sources)

  const {
    DOM: home_dom$,
    HTTP: home_http$,
    post_id$: home_post_id$,
    navigation$: home_navigation$,
  } = home ({
    ...sources,
    navigation$: nav_bar_navigation$,
  })

  const {
    DOM: recent_dom$,
    HTTP: recent_http$,
    post_id$: recent_post_id$,
    navigation$: recent_navigation$,
  } = recent ({
    ...sources,
    navigation$: nav_bar_navigation$,
  })

  const post_id$ =
    xs.merge (...[
      home_post_id$,
      recent_post_id$,
    ])

  const {
    DOM: article_dom$,
    HTTP: article_http$,
  } = article ({
    ...sources,
    post_id$,
    user_id$,
  })

  const navigation$ =
    xs.merge (...[
      account_navigation$,
      nav_bar_navigation$,
      home_navigation$,
      recent_navigation$,
    ])

  return {
    DOM: (
      xs.combine (...[
        navigation$,
        nav_bar_dom$,
        header_dom$,
        home_dom$,
        recent_dom$,
        article_dom$,
        account_dom$,
      ])
        .map (([
          navigation,
          nav_bar_dom,
          header_dom,
          home_dom,
          recent_dom,
          article_dom,
          account_dom,
        ]) => {
          const selected_tab_dom = {
            home_dom,
            recent_dom,
            article_dom,
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
        article_http$,
        account_http$,
      ])
    ),
  }
}
