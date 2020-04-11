const il = require('./il')
const bagimsizBolum = require('./bagimsizbolum')
const mahalle = require('./mahalle')
const fs = require('fs')
const {
  ora,
  cliProgress,
} =require( '../core/imports')
const Il = require('./il')
const Ilce = require('./ilce')
const Mahalle = require('./mahalle')
const Sokak = require('./sokak')
const Bina = require('./bina')
const writer = require('../middlewares/writer')
const getter = require('../middlewares/getter')
const controller = require('../middlewares/controller')
const instance = async(api) => {


  const IlParent = new Il({api})
  await IlParent.setData()
  await IlParent.getData()

  const IlceParent = new Ilce({api})
  await IlceParent.setData({IlParent})
  await IlceParent.getData()

  const MahalleParent = new Mahalle({api})
  await MahalleParent.setData({IlParent,IlceParent})
  await MahalleParent.getData()

  const SokakParent = new Sokak({api})
  await SokakParent.setData({IlParent,IlceParent,MahalleParent})
  await SokakParent.getData()

}

module.exports = instance
