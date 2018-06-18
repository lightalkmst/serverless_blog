import xs from 'xstream'

import init from './init'

import login from './app/user/login'
import logout from './app/user/logout'
import profile from './app/user/profile'
import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import recent from './app/recent/recent'
import article from './app/article/article'

export default sources => {
  const {DOM, HTTP} = sources

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
  })

  const {
    DOM: login_dom$,
    // HTTP: login_http$,
  } = login (sources)

  // const {
  //
  // } = logout (sources)
  //
  // const {
  //
  // } = profile (sources)

  const page$ =
    xs.merge (...[
      // navigation$,
      // redirect user to login if session times out
      xs.merge (...[
        navigation$,
        xs.merge (...[
          HTTP.select ().flatten ()
        ])
          .map (D.get ('authenticated'))
          .fold ((a, h) => [h, a[0] && !h], [false, false])
          .map (A.get (1))
          .filter (F.id)
          .mapTo ('login')
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
        login_dom$,
      ])
        .map (([
          page,
          nav_bar_dom,
          header_dom,
          recent_dom,
          article_dom,
          login_dom,
        ]) => {
          var selected_tab_dom = {
            recent_dom,
            article_dom,
            login_dom,
          }[`${page}_dom`]

          // var selected_tab_dom = article_dom

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
      ])
    ),
  }
}
