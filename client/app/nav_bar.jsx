import xs from 'xstream'

import init from '../init'

import css from './styles.css'

export default sources => {
  const {DOM} = sources

  const nav_state$ =
    xs.merge (...A.map (x => DOM.select (`#${x}_tab`).events ('click').mapTo (x)) ([
      'service_browser',
      'feature_browser',
      'service_adder',
      'feature_adder',
      'feature_tagger',
    ]))
      .startWith ('service_browser')

  return {
    DOM: (
      // TODO: style highlighting for selected state
      nav_state$.map (() =>
        <div className='nav_bar'>
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
