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
  // //
  // const SokakParent = new Sokak({api})
  // await SokakParent.setData({IlParent,IlceParent,MahalleParent})
  // await SokakParent.getData()

  // const ilceSpinner = ora('Ilceler Aliniyor').start()
  // let Ilceler;
  // if(!controller('ilceler')){
  //   Ilceler = await (new Ilce({api,ilceSpinner})).setData(Iller)
  //   writer('ilceler',Ilceler)
  //   ilceSpinner.succeed('Ilceler alindi, kayit edildi')
  // }
  // else{
  //   Ilceler = getter('ilceler')
  //   ilceSpinner.succeed('Ilceler kayitli dosyadan alindi')
  // }
  //
  // const mahalleSpinner = ora('Mahalleler Aliniyor').start()
  // let Mahalleler;
  // if(!controller('Mahalleler')){
  //   Mahalleler = await (new Mahalle({api,mahalleSpinner})).setData(Ilceler)
  //   writer('Mahalleler',Mahalleler)
  //   mahalleSpinner.succeed('Mahalleler alindi, kayit edildi')
  // }
  // else{
  //   Mahalleler = getter('Mahalleler')
  //   mahalleSpinner.succeed('Mahalleler kayitli dosyadan alindi')
  // }
  //
  // const sokakSpinner = ora('Sokaklar Aliniyor').start()
  // let Sokaklar;
  // if(!controller('Sokaklar')){
  //   Sokaklar = await (new Sokak({api,sokakSpinner})).setData(Mahalleler)
  //   writer('Sokaklar',Sokaklar)
  //   sokakSpinner.succeed('Sokaklar alindi, kayit edildi')
  // }
  // else{
  //   Sokaklar = getter('Sokaklar')
  //   sokakSpinner.succeed('Sokaklar kayitli dosyadan alindi')
  // }

  // const binaSpinner = ora('Binalar Aliniyor').start()
  // let Binalarlar;
  // if(!controller('Binalarlar')){
  //   Binalarlar = await (new Bina({api,binaSpinner})).setData(Sokaklar)
  //   writer('Binalarlar',Binalarlar)
  //   binaSpinner.succeed('Binalarlar alindi, kayit edildi')
  // }
  // else{
  //   Binalarlar = getter('Binalarlar')
  //   binaSpinner.succeed('Binalarlar kayitli dosyadan alindi')
  // }
  // console.log(Sokaklar.length);

  // const mahalleSpinner = ora('Mahalleler Aliniyor').start()
  // const Mahalleler = await (new Mahalle({api,mahalleSpinner})).setData(Ilceler)
  // mahalleSpinner.succeed('Mahalleler alindi')

  // console.log(Ilceler.length);



  // fs.writeFile('mynewfile3.txt', JSON.stringify(aab), function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });
  // return aab
}

module.exports = instance
