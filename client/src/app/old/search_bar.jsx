import xs from 'xstream'

import init from '../init'

const search_terms = [
  'name',
  'description',
]

const dropdown_list = id => values =>
  <select id={id}>
    <option disabled selected value style="display: none"></option>
    {A.map (x => <option value={x}>{`${S.upper (x[0])}${S.substr (1) (-1) (x)}`}</option>) (values)}
  </select>

export default sources => {
  return {
    DOM: (
      xs.of (
        <div>
          {'Search for an API: '}
          {dropdown_list ('search_target') (search_target)}
          {' '}
          {dropdown_list ('search_terms') (search_terms)}
          {' '}
          <input type='text' id='search_term' />
          {' '}
          <button>Search</button>
        </div>
      )
    ),
    // search_state$,
  }
}
