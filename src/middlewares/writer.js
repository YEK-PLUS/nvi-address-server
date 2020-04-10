const fs = require('fs')
const path = require('path')
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
const writer = (file,data) => {
  ensureDirectoryExistence(file)
  fs.writeFileSync(`${file}.json`, JSON.stringify(data));
}

module.exports = writer
