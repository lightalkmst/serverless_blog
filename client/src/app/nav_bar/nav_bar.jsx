import xs from 'xstream'

import init from '../../init'

import blog_logo from './blog_logo'

export default sources => {
  const {DOM} = sources

  const navigation$ =
    xs.merge (...[
      ...A.map (x => DOM.select (`#${x}_tab`).events ('click').mapTo (x)) ([
        'home',
        'archive',
        'about',
        'login',
        'profile',
        'logout',
      ]),
      DOM.select ('logo_tab').events ('click').mapTo ('home')
    ])
      .startWith ('home')

  const {DOM: blog_logo_dom$} = blog_logo (sources)

  return {
    DOM: (
      // TODO: style highlighting for selected state
      xs.combine (...[
        navigation$,
        blog_logo_dom$,
      ])
        .map (([
          navigation,
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
              <li id='archive_tab'>Archive</li>
              <li id='about_tab'>About</li>
              <li id='login_tab'>Login</li>
              <li id='profile_tab'>Profile</li>
              <li id='logout_tab'>Logout</li>
            </ul>
          </div>
      ])
    ),
    navigation$,
  }
}
