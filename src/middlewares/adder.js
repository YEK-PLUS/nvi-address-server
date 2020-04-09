const fs = require('fs')
const writer = (file,data) => {
  fs.appendFileSync(`${file}.json`, `\n${JSON.stringify(data)}`);
}

module.exports = writer
