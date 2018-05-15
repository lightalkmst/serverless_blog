import xs from 'xstream'

import init from '../init'

import dev_blog_post from './dev_blog_post'

export default sources => {
  const {DOM, HTTP} = sources

  return {
    DOM: (
      // HTTP.select ('get_post')
        // .map ()
        // .startWith (dev_blog_post)
        // .map (post => {
        //   <div id='blog_post'>
        //     {post}
        //   </div>
        // })
      xs.of (dev_blog_post)
        .map (post =>
          <div>
            {post}
          </div>
      )
    ),
  }
}
