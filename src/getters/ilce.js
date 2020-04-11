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
    getNode=async(n,m)=>{
      return this.response[n].ilceler[m]
    }
    getNodes = async (n)=>{
    return this.response[n].ilceler
  }
    getNodeLength=async(n)=>{
      const nodes = await this.getNodes(n)
      return Object.keys(nodes).length
    }
    looperCollector= async() =>{
      const {IlParent} = this.parents
      this.totalLength = await IlParent.getLength()
      this.totalProgress = 0


      const ilLength = await IlParent.getLength()

      const hub = []

      for (var ilNumber = 1; ilNumber < ilLength+1; ilNumber++) {
        const il = await IlParent.getNode(ilNumber)
        const {kimlikNo} = il

        const ilceler = await this.connector({
          ilKimlikNo:kimlikNo
        })
        this.console()


        const ilData = {kimlikNo,il,ilceler}
        await this.writer(undefined,ilData,`${kimlikNo}_`)
        hub.push(ilData)
      }
      return await this.formatData(hub)
    }
    constructorName='Ilceler'
    mainFileName = 'Ilceler'
    path='ilceListesi'
    argument='ilKimlikNo'
}
module.exports = Ilce
