import green_curry from 'green_curry'
green_curry (['globalize', 'short F.c'])

window.HTTP_auth = F.c (
  D.get ('body')
  >> JSON.parse
  >> D.get ('auth')
)

window.HTTP_resp = F.c (
  D.get ('body')
  >> JSON.parse
  >> D.get ('response')
)

import {} from './styles/general.css'
import {} from './styles/nav_bar.css'
import {} from './styles/header.css'
import {} from './styles/recent.css'
import {} from './styles/article.css'
import {} from './styles/user.css'
