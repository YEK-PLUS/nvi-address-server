const fs = require('fs')
const writer = (file,data) => {
  fs.writeFileSync(`${file}.json`, JSON.stringify(data));
}

module.exports = writer
