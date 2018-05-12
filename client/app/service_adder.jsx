import xs from 'xstream'

import init from '../init'

import adder from '../common/adder'

export default adder ({
  label: 'Service',
  id: 'service',
}) ([{
  label: 'Name',
  id: 'name',
}, {
  label: 'Description',
  id: 'description',
}, {
  label: 'Source Code URL',
  id: 'codebase',
}])
