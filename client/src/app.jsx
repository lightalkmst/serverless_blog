import xs from 'xstream'

import init from './init'

import nav_bar from './app/nav_bar'
import blog_post from './app/blog_post'

// import service_browser from './app/service_browser'
// import feature_browser from './app/feature_browser'
// import service_adder from './app/service_adder'
// import feature_adder from './app/feature_adder'
// import feature_tagger from './app/feature_tagger'

// tabbed selection of different views

export default sources => {
  const {DOM, HTTP} = sources

  const {
    DOM: nav_bar_dom$,
    nav_state$,
  } = nav_bar (sources)

  const {
    DOM: blog_post_dom$,
  } = blog_post (sources)

  return {
    DOM: (
      xs.combine (...[
        nav_bar_dom$,
        nav_state$,
        blog_post_dom$,
      ])
        .map (([
          nav_bar_dom,
          nav_state,
          blog_post_dom,
        ]) => {
          // var selected_tab_dom = {
          // }[`${nav_state}_dom`]

          var selected_tab_dom = blog_post_dom

          F.log (blog_post_dom)

          return (
            <div>
              {nav_bar_dom}
              <div className='content'>
                {selected_tab_dom}
              </div>
            </div>
          )
      })
    ),
    HTTP: (
      xs.merge (...[
        // service_browser_http$,
        // feature_browser_http$,
        // service_adder_http$,
        // feature_adder_http$,
        // feature_tagger_http$,
      ])
    ),
  }
}
