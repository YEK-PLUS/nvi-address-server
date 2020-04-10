const {
  axios,
  urls,
  jssoup,
  cliProgress,
  ora,
  setCookie
} =require( '../core/imports')
const sleep = require('../middlewares/sleep')
const controller = require('../middlewares/controller')
const writer = require('../middlewares/writer')
const getter = require('../middlewares/getter')
const Yapi = require('../yapi')

class Il extends Yapi{
  constructor(props) {
    super(props)
  }
  constructorName='Iller'
  mainFileName = 'Iller'
  path='ilListesi'
}
module.exports = Il
