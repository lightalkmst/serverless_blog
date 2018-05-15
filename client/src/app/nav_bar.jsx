import xs from 'xstream'

import init from '../init'

import blog_logo from './blog_logo'

export default sources => {
  const {DOM} = sources

  const nav_state$ =
    xs.merge (...A.map (x => DOM.select (`#${x}_tab`).events ('click').mapTo (x)) ([
    ]))
      .startWith ('')

  const {DOM: blog_logo_dom$} = blog_logo (sources)

  return {
    DOM: (
      // TODO: style highlighting for selected state
      xs.combine (...[
        nav_state$,
        blog_logo_dom$,
      ])
        .map (([
          nav_state,
          blog_logo_dom,
        ]) =>
          <div className='nav_bar'>
            <div id='logo_tab' className='logo'>
              {blog_logo_dom}
            </div>
            <ul>
              <li id='service_browser_tab'>Browse Services</li>
              <li id='feature_browser_tab'>Browse Feature</li>
              <li id='service_adder_tab'>Add Service</li>
              <li id='feature_adder_tab'>Add Feature</li>
              <li id='feature_tagger_tab'>Mark Dependency</li>
            </ul>
          </div>
      )
    ),
    nav_state$,
  }
}
