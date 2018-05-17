import xs from 'xstream'

import init from '../../init'

import blog_logo from './blog_logo'

export default sources => {
  const {DOM} = sources

  const nav_state$ =
    xs.merge (...A.map (x => DOM.select (`#${x}_tab`).events ('click').mapTo (x)) ([
    ]))
      .startWith ('home')

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
        ]) => [
          // this array form is an exception for spacing
          // force the empty div to take space
          <div className='nav_bar_placeholder'>{'\u00A0'}</div>,
          <div className='nav_bar'>
            <div id='logo_tab' className='logo'>
              {blog_logo_dom}
            </div>
            <ul>
              <li id='home_tab'>Home</li>
              <li id='_tab'>Archive</li>
              <li id='_tab'>About</li>
              <li id='_tab'>Login</li>
              <li id='_tab'>Profile</li>
              <li id='_tab'>Logout</li>
            </ul>
          </div>
      ])
    ),
    nav_state$,
  }
}
