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

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
window.time_string = timestamp => {
  const date = new Date (timestamp)
  const day = date.getDate ()
  const month = date.getMonth () // reminder: 0-indexed
  const year = date.getFullYear ()
  const hour = date.getHours ()
  const minute = date.getMinutes ()
  return `${months[month]} ${day}, ${year} ${hour}:${minute}`
}

import {} from './styles/general.css'
import {} from './styles/nav_bar.css'
import {} from './styles/header.css'
import {} from './styles/recent.css'
import {} from './styles/text.css'
import {} from './styles/user.css'

document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
