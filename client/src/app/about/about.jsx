import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

export default sources => {
  const {DOM} = sources

  return {
    DOM: (
      xs.of (
        <div id='login' className='padded'>
        </div>
      )
    ),
  }
}
