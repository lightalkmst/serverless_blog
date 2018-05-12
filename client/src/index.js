import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import main from './app'

run (main, {
  DOM: makeDOMDriver ('#root'),
  HTTP: makeHTTPDriver (),
})
