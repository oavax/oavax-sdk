
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./oavax-sdk.cjs.production.min.js')
} else {
  module.exports = require('./oavax-sdk.cjs.development.js')
}
