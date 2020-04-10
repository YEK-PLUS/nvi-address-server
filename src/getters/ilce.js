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
const adder = require('../middlewares/adder')
const Yapi = require('../yapi')
  class Ilce extends Yapi{
    constructor(props) {
      super(props)
    }
    constructorName='Ilceler'
    mainFileName = 'Ilceler'
    path='ilceListesi'
    argument='ilKimlikNo'
}
module.exports = Ilce
