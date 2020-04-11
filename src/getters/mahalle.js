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
  class Mahalle extends Yapi{
    constructor(props) {
      super(props)
    }
    getNode=async(n,m,p)=>{
      return this.response[n].ilceler[m].mahalleler[p]
    }
    getNodes=async(n,m)=>{
      return this.response[n].ilceler[m].mahalleler
    }
    getNodeLength=async(n,m)=>{
      const nodes = await this.getNodes(n,m)
      return Object.keys(nodes).length
    }
    looperCollector= async() =>{
      const {IlParent,IlceParent} = this.parents
      this.totalLength = await IlceParent.getLength()
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

              const mahalleler = await this.connector({
                ilceKimlikNo
              })
              this.console()

              const ilceData = {kimlikNo:ilceKimlikNo,ilce,mahalleler}
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
    constructorName='Mahalleler'
    mainFileName = 'Mahalleler'
    path='mahalleKoyBaglisiListesi'
    argument='ilceKimlikNo'
}
module.exports = Mahalle
