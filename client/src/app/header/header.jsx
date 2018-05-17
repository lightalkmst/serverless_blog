import xs from 'xstream'

import init from '../../init'

export default sources => {
  const {DOM} = sources

  return {
    DOM: (
      xs.of (
        <div>
          {/* force the empty div to take space */}
          <div className='header_placeholder'>{'\u00A0'}</div>
          <div className='header text_hover'>Welcome to the Troll Hole!</div>
        </div>
      )
    ),
  }
}
