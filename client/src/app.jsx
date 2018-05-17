import xs from 'xstream'

import init from './init'

import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import home from './app/home/home'
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
    DOM: home_dom$,
    HTTP: home_http$,
    post_id$,
    post_select$,
  } = home ({
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

  const page$ =
    xs.merge (...[
      navigation$,
      post_select$,
    ])

  return {
    DOM: (
      xs.combine (...[
        page$,
        nav_bar_dom$,
        header_dom$,
        home_dom$,
        article_dom$,
      ])
        .map (([
          page,
          nav_bar_dom,
          header_dom,
          home_dom,
          article_dom,
        ]) => {
          var selected_tab_dom = {
            home_dom,
            article_dom,
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
        home_http$,
        article_http$,
      ])
    ),
  }
}
