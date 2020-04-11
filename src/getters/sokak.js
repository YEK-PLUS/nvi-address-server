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
class Sokak extends Yapi{
  constructor(props) {
    super(props)
  }
  getNode = async (n,m,p,r)=>{
    return this.response[n].ilceler[m].mahalleler[p].sokaklar[r]
  }
  getNodes = async (n,m,p)=>{
    return this.response[n].ilceler[m].mahalleler[p].sokaklar
  }
  getParentNodeLength = async (n,m,p)=>{
    const nodes = await this.getNodes(n,m,p)
    return Object.keys(nodes).length
  }
  looperCollector = async () => {
    const {IlParent,IlceParent,MahalleParent} = this.parents
    this.totalLength = await MahalleParent.getLength()
    this.totalProgress = 0

    const ilLength = await IlParent.getLength()

    const hub = []

    for (var ilNumber = 1; ilNumber < ilLength+1; ilNumber++) {
      const il = await IlParent.getNode(ilNumber)
      const {kimlikNo} = il

      const ilHub = [];

      const ilceLength = await IlceParent.getNodeLength(ilNumber)
      for (var ilceNumber = 1; ilceNumber < ilceLength+1; ilceNumber++) {

        const ilce = await IlceParent.getNode(ilNumber,ilceNumber)
        const {kimlikNo : ilceKimlikNo} = ilce

        const ilceHub = [];

        const mahalleLength = await MahalleParent.getNodeLength(ilNumber,ilceNumber)
        for (var mahalleNumber = 1; mahalleNumber < mahalleLength+1; mahalleNumber++) {

          const mahalle = await MahalleParent.getNode(ilNumber,ilceNumber,mahalleNumber)
          const {kimlikNo: mahalleKoyBaglisiKimlikNo} = mahalle

          const sokaklar = await this.connector({
            mahalleKoyBaglisiKimlikNo
          })
          this.console()

          const mahalleData = {kimlikNo:mahalleKoyBaglisiKimlikNo,mahalle,sokaklar}
          await this.writer(undefined,mahalleData,`${kimlikNo}_${ilceKimlikNo}_${mahalleKoyBaglisiKimlikNo}_`)
          ilceHub.push(mahalleData)
        }

        const formattedIlceHub = await this.formatData(ilceHub)
        const ilceData = {kimlikNo:ilceKimlikNo,ilce,mahalleler:formattedIlceHub}
        await this.writer(undefined,ilceData,`${kimlikNo}_${ilceKimlikNo}_`)
        ilHub.push(ilceData)
      }

      const formattedIlHub = await this.formatData(ilHub)
      const ilData = {kimlikNo,il,ilceler:formattedIlHub}
      await this.writer(undefined,ilData,`${kimlikNo}_`)
      hub.push(ilData)
    }
    return await this.formatData(hub)

  }
  constructorName='Sokaklar'
  mainFileName = 'Sokaklar'
  path='yolListesi'
  argument='mahalleKoyBaglisiKimlikNo'
}
module.exports = Sokak
