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
class Bina extends Yapi{
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
    const {IlParent,IlceParent,MahalleParent,SokakParent,BinaParent} = this.parents
    this.totalLength = await BinaParent.getLength()
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

          const mahalleHub = [];

          const sokakLength = await SokakParent.getNodeLength(ilNumber,ilceNumber,mahalleNumber)
          for (var sokakNumber = 1; sokakNumber < sokakLength+1; sokakNumber++) {
            const sokak = await SokakParent.getNode(ilNumber,ilceNumber,mahalleNumber,sokakNumber)
            const {kimlikNo: yolKimlikNo} = sokak

            const sokakHub = [];

            const binaLength = await BinaParent.getNodeLength(ilNumber,ilceNumber,mahalleNumber,sokakNumber)

            for (var binaNumber = 1; binaNumber < binaLength+1; binaNumber++) {
              const bina = await BinaParent.getNode(ilNumber,ilceNumber,mahalleNumber,sokakNumber,binaNumber)
              const {kimlikNo:binaKimlikNo} = bina

              const daireler = await this.connector({
                mahalleKoyBaglisiKimlikNo,
                binaKimlikNo
              })

              this.console()

              const binaData = {kimlikNo:binaKimlikNo,bina,daireler}
              await this.writer(undefined,binaData,`${kimlikNo}_${ilceKimlikNo}_${mahalleKoyBaglisiKimlikNo}_${yolKimlikNo}_${binaKimlikNo}_`)
              sokakHub.push(binaData)
            }

            const formattedSokakHub = await this.formatData(sokakHub)
            const sokakData = {kimlikNo:yolKimlikNo,sokak,binalar:formattedSokakHub}
            await this.writer(undefined,sokakData,`${kimlikNo}_${ilceKimlikNo}_${mahalleKoyBaglisiKimlikNo}_${yolKimlikNo}_`)
            mahalleHub.push(sokakData)
          }

          const formattedMahalleHub = await this.formatData(mahalleHub)
          const mahalleData = {kimlikNo:mahalleKoyBaglisiKimlikNo,mahalle,sokaklar:formattedMahalleHub}
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
  constructorName='Bagimsiz Bolum'
  mainFileName = 'Bagimsiz Bolum'
  path='bagimsizBolumListesi'
  argument='binaKimlikNo'
}
module.exports = Bina
