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
    nav_state$,
  } = nav_bar (sources)

  // TODO: search bar
  const {
    DOM: header_dom$,
  } = header (sources)

  const {
    DOM: home_dom$,
    HTTP: home_http$,
    post_id_state$,
  } = home ({
    ...sources,
    nav_state$,
  })

  const {
    DOM: blog_post_dom$,
  } = blog_post ({
    ...sources,
    post_id_state$,
  })

  return {
    DOM: (
      xs.combine (...[
        nav_bar_dom$,
        nav_state$,
        header_dom$,
        home_dom$,
        blog_post_dom$,
      ])
        .map (([
          nav_bar_dom,
          nav_state,
          header_dom,
          home_dom,
          blog_post_dom,
        ]) => {
          var selected_tab_dom = {
            home_dom,
            blog_post_dom,
          }[`${nav_state}_dom`]

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
      ])
    ),
  }
}
