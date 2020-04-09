const fs = require('fs')

const controller = (filename) => {
  return fs.existsSync(`${filename}.json`)
}

module.exports = controller
