import xs from 'xstream'

import init from '../../init'

export default sources => {
  const {DOM} = sources

  return {
    DOM: (
      xs.merge (...[
        DOM.select ('#logo').events ('mouseenter').mapTo (false),
        DOM.select ('#logo').events ('mouseleave').mapTo (true),
      ])
        .startWith (true)
        .map (hover =>
          hover
          ? <img id='logo' src='catroomguardian.jpg' className='logo' />
          : <img id='logo' src='yxyha.jpg' className='logo' />
      )
    ),
  }
}
