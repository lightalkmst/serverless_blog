import xs from 'xstream'

import init from '../../init'

export default sources => {
  return {
    DOM: (
      xs.of (
        <div id='login' className='login'>
          <div className='panel'>
            <div>
              <div className='title'>
                <h1>{'Login'}</h1>
              </div>
              <div className='center padded'>
                {'Username: '}<input id='login_user'></input>
                <br />
                {'Password: '}<input id='login_pass'></input>
                <br />
                <button id='login_send'>{'Login'}</button>
              </div>
            </div>
          </div>
        </div>
      )
    ),
    // HTTP: xs.of (1),
  }
}
