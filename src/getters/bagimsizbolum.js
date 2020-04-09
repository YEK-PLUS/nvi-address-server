const {
  axios,
  urls,
  jssoup,
  cliProgress,
  ora,
  setCookie
} =require( '../core/imports')
const sleep = require('../middlewares/sleep')
const bagimsizBolumGetter = async(api,{
    mahalleKoyBaglisiKimlikNo,
    binaKimlikNo
  },bars) => {
    console.log(bagimsizbolumler.length,'bagimsiz');
  const bagimsizbolumler = await (await api.post('bagimsizBolumListesi',{
      mahalleKoyBaglisiKimlikNo,
      binaKimlikNo
    })).data
    bars.BarBagimsizBolum.setTotal(bagimsizbolumler.length)

    await sleep(2000)

  const hub = {}
    await Promise.all(bagimsizbolumler.map(async(e,i)=>{
      bars.BarBagimsizBolum.setTotal(bagimsizbolumler.length)
      hub[e.kimlikNo] = e
      bars.BarBagimsizBolum.update(i)
    }))
  return hub
}

module.exports= bagimsizBolumGetter
