import xs from 'xstream'

import init from '../init'

export default () => {
  return {
    DOM: (
      xs.of (
        <img src='smiley.gif' className='logo' />
      )
    ),
  }
}
