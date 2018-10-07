import xs from 'xstream'

import init from '../../init'

import blog_logo from './blog_logo'

export default sources => {
  const {DOM} = sources

  const navigation$ =
    xs.merge (...[
      ...A.map (x => DOM.select (`#${x}_tab`).events ('click').mapTo (x)) ([
        'home',
        'newest',
        'archive',
        'about',
        'account'
      ]),
      DOM.select ('#logo_tab').events ('click').mapTo ('home'),
    ])
      .startWith ('home')

  const {DOM: blog_logo_dom$} = blog_logo (sources)

  return {
    DOM: (
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
            {'\u00A0'}
            <br />
            <ul>
              <li id='home_tab'>Home</li>
              <li id='newest_tab'>Newest Posts</li>
              <li id='archive_tab'>Archive</li>
              <li id='about_tab'>About</li>
              <li id='account_tab'>Account</li>
            </ul>
          </div>
      ])
    ),
    navigation$,
  }
}
