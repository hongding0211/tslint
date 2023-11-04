const { minimatch } = require('minimatch')

const ignore = [
  './components/order-elements/after-rating-popup/**',
]

const str = './components/order-elements/after-rating-popup/index.tsx'

const m = minimatch(str, ignore[0])
