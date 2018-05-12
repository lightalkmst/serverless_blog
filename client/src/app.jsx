import xs from 'xstream'

import init from './init'

import nav_bar from './app/nav_bar'
import service_browser from './app/service_browser'
// import feature_browser from './app/feature_browser'
import service_adder from './app/service_adder'
import feature_adder from './app/feature_adder'
// import feature_tagger from './app/feature_tagger'

// tabbed selection of different views

export default sources => {
  const {DOM, HTTP} = sources

  const {
    DOM: nav_bar_dom$,
    nav_state$,
  } = nav_bar (sources)

  const {
    DOM: service_browser_dom$,
  //  HTTP: service_browser_http$,
  } = service_browser (sources)

  // const {
  //   DOM: feature_browser_dom$,
  //   HTTP: feature_browser_http$,
  // } = feature_browser (sources)

  const {
    DOM: service_adder_dom$,
    HTTP: service_adder_http$,
  } = service_adder (sources)

  const {
    DOM: feature_adder_dom$,
    HTTP: feature_adder_http$,
  } = feature_adder (sources)

  // const {
  //   DOM: feature_tagger_dom$,
  //   HTTP: feature_tagger_http$,
  // } = feature_tagger (sources)

  return {
    DOM: (
      xs.combine (...[
        nav_bar_dom$,
        nav_state$,
        service_browser_dom$,
        // feature_browser_dom$,
        service_adder_dom$,
        feature_adder_dom$,
        // feature_tagger_dom$,
      ])
        .map (([
          nav_bar_dom,
          nav_state,
          service_browser_dom,
          // feature_browser_dom,
          service_adder_dom,
          feature_adder_dom,
          // feature_tagger_dom,
        ]) => {
          var selected_tab_dom = {
            service_browser_dom,
            // feature_browser_dom,
            service_adder_dom,
            feature_adder_dom,
            // feature_tagger_dom,
          }[`${nav_state}_dom`]

          return (
            <div>
              {nav_bar_dom}
              {selected_tab_dom}
            </div>
          )
      })
    ),
    HTTP: (
      xs.merge (...[
        // service_browser_http$,
        // feature_browser_http$,
        service_adder_http$,
        feature_adder_http$,
        // feature_tagger_http$,
      ])
    ),
  }
}
