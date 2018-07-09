import xs from 'xstream'

import init from './init'

import account from './app/user/account'
import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import recent from './app/recent/recent'
import article from './app/article/article'

export default sources => {
  const {DOM, HTTP} = sources

  const {
    DOM: account_dom$,
    HTTP: account_http$,
    user_id$,
  } = account (sources)

  const {
    DOM: nav_bar_dom$,
    navigation$,
  } = nav_bar (sources)

  // TODO: search bar
  const {
    DOM: header_dom$,
  } = header (sources)

  const {
    DOM: recent_dom$,
    HTTP: recent_http$,
    post_id$,
    post_select$,
  } = recent ({
    ...sources,
    navigation$,
  })

  const {
    DOM: article_dom$,
    HTTP: article_http$,
  } = article ({
    ...sources,
    post_id$,
    user_id$,
  })

  const page$ =
    xs.merge (...[
      xs.merge (...[
        navigation$,
        // redirect user to login if session times out
        HTTP.select ().flatten ()
          .map (D.get ('authenticated'))
          .fold ((a, h) => [h, a[0] && !h], [false, false])
          .map (A.get (1))
          .filter (F.id)
          .mapTo ('login'),
      ]),
      post_select$,
    ])

  return {
    DOM: (
      xs.combine (...[
        page$,
        nav_bar_dom$,
        header_dom$,

        recent_dom$,
        article_dom$,
        account_dom$,
      ])
        .map (([
          page,
          nav_bar_dom,
          header_dom,
          recent_dom,
          article_dom,
          account_dom,
        ]) => {
          var selected_tab_dom = {
            recent_dom,
            article_dom,
            account_dom,
          }[`${page}_dom`]

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
        recent_http$,
        article_http$,
        account_http$,
      ])
    ),
  }
}
