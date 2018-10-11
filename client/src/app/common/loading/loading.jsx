import xs from 'xstream'

import init from '../../../init'

export default sources => {
  const {navigation$} = sources

  return {
    DOM: (
      navigation$.mapTo (
        <div className='center padded'>
          <img id='logo' src='ajax-loader.gif' className='loading' alt='Loading' width='50' height='50' />
        </div>
      )
    ),
  }
}
