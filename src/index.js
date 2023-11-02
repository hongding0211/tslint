import data from '../output.json' assert { type: 'json'}
import chalk from 'chalk'

function flatArray(arr) {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatArray(val)) : acc.concat(val), [])
}

function parse(data) {
  const {
    program: {
      semanticDiagnosticsPerFile
    }
  } = data

  return flatArray(semanticDiagnosticsPerFile).filter(e => typeof e === 'object' && e.file === './components/order-elements/after-rating-popup/index.tsx')
}


const errors = parse(data)

for (const err of errors) {
  console.log(`${err.file}\r\n${err.messageText}\r\n\r\n\r\n`)
}