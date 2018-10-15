import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'

import init from '../../init'

export default sources => {
  const {DOM} = sources

  return {
    DOM: (
      xs.of (
        <div id='about' className=''>
          <h1>About</h1>
          We do not have an about page because the author of this blog is too lazy to write one
        </div>
      )
    ),
  }
}
