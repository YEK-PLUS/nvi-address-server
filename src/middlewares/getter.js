const fs = require('fs')
const writer = (file) => {
  return JSON.parse(fs.readFileSync(`${file}.json`,'utf8'))
}

module.exports = writer
