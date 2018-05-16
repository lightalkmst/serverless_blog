import xs from 'xstream'

import init from '../../init'

export default sources => {
  const {DOM} = sources

  return {
    DOM: (
      xs.of (
        <div>
          <div className='header_placeholder'>{'\u00A0'}</div>
          <div className='header'>Welcome to the Troll Hole!</div>
        </div>
      )
    ),
  }
}
