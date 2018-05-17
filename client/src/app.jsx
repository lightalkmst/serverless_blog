import xs from 'xstream'

import init from './init'

import nav_bar from './app/nav_bar/nav_bar'
import header from './app/header/header'
import home from './app/home/home'
import blog_post from './app/post/blog_post'

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
    DOM: blog_post_dom$,
    HTTP: blog_post_http$,
  } = blog_post ({
    ...sources,
    post_id$,
  })

  const page$ =
    xs.merge (...[
      navigation$,
      post_select$.mapTo ('blog_post'),
    ])

  return {
    DOM: (
      xs.combine (...[
        page$,
        nav_bar_dom$,
        header_dom$,
        home_dom$,
        blog_post_dom$,
      ])
        .map (([
          page,
          nav_bar_dom,
          header_dom,
          home_dom,
          blog_post_dom,
        ]) => {
          var selected_tab_dom = {
            home_dom,
            blog_post_dom,
          }[`${page}_dom`]

          // var selected_tab_dom = blog_post_dom

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
        blog_post_http$,
      ])
    ),
  }
}
