const {
  axios,
  urls,
  jssoup,
  cliProgress,
  ora,
  setCookie
} =require( '../core/imports')
const bagimsizBolum = require('./bagimsizbolum')

const binaGetter = async(api,{
    mahalleKoyBaglisiKimlikNo,
    yolKimlikNo
  },bars) => {

  const binalar = await (await api.post('binaListesi',{
      mahalleKoyBaglisiKimlikNo,
      yolKimlikNo
    })).data
    bars.BarBina.setTotal(binalar.length)

  const hub = {}
  // console.log(binalar.length,'binalar');

  await Promise.all(binalar.map(async(e,i)=>{
    bars.BarBina.setTotal(binalar.length)
    const bagimsizbolumler = await bagimsizBolum(api,{
      mahalleKoyBaglisiKimlikNo,
      binaKimlikNo:e.kimlikNo
    },bars)
    hub[e.kimlikNo] = {...e,bagimsizbolumler}
    bars.BarBina.update(i)
  }))
  return hub
}

module.exports= binaGetter
