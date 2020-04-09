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
class Mahalle {
  constructor(props) {
    this.spinner = ora('Mahalleler Aliniyor').start()
    this.props = props
    this.fileName = 'Mahalleler'
  }
  setData = async ({IlParent,IlceParent}) =>{
    this.props.IlParent = IlParent
    this.props.IlceParent = IlceParent
  }
  saveData = async () =>{
    writer(this.fileName,this.response)
  }
  getNode = async (n,m,p)=>{
    return this.response[n].ilceler[m].mahalleler[p]
  }
  getNodes = async (n,m)=>{
    return this.response[n].ilceler[m].mahalleler
  }
  getLength = async ()=>{
    let length = 0
    const {response }= this
    Object.keys(response).forEach(function (il) {

      Object.keys(response[il].ilceler).forEach(function (ilce) {

        Object.keys(response[il].ilceler[ilce].mahalleler).forEach(function (mahalle) {
        	length ++;
        });

      });

    });
    return length
  }
  getParentNodeLength = async (n,m)=>{
    const nodes = await this.getNodes(n,m)
    return Object.keys(nodes).length
  }
  formatData = async(data =this.response )=>{
    const hub = {}
    await Promise.all(
      await data.map(async (e,i)=>{
        hub[i+1] = (e)
      })
    )
    return hub
  }
  getData = async (e) => {
    if(!controller(this.fileName)){
      await this.getDataFromNvi()
      this.spinner.succeed('Mahalleler alindi, kayit edildi')
    }
    else{
      await this.getDataFromLocal()
      this.spinner.succeed('Mahalleler kayitli dosyadan alindi')
    }
  }
  looperCollector = async () => {
    const {IlceParent,IlParent,api} = this.props

    const totalIlceLength = await IlceParent.getLength()
    let totalIlceProgress = 0
    const ilLength = await IlParent.getLength()

    const hub = []

    for (var ilNumber = 1; ilNumber < ilLength+1; ilNumber++) {
      const ilceLength = await IlceParent.getParentNodeLength(ilNumber)
      const il = await IlParent.getNode(ilNumber)
      const ilHub = []
      for (var ilceNumber = 1; ilceNumber < ilceLength+1; ilceNumber++) {
        this.spinner.text = (`Mahalleler Aliniyor | ${totalIlceProgress}/${totalIlceLength}`)
        const ilce = await IlceParent.getNode(ilNumber,ilceNumber)
        const {kimlikNo} = ilce
        const data = await this.getter(ilce)
        const formattedData = await this.formatData(data)
        ilHub.push({kimlikNo,ilce,mahalleler:{...formattedData}})
        totalIlceProgress++;
      }
      const formattedIlHub = await this.formatData(ilHub)
      const {kimlikNo} = il
      hub.push({kimlikNo,il,ilceler:{...formattedIlHub}})

    }


    return await this.formatData(hub)
  }
  getter = async (e) =>{
    const {api} = this.props
    const mahalleler = (
      await api.post('mahalleKoyBaglisiListesi',{
        ilceKimlikNo:e.kimlikNo
      })
    ).data
    return mahalleler
  }
  getDataFromNvi = async () =>{
    const mahalleler = await this.looperCollector()
    this.response = mahalleler
    // await this.formatData()
    await this.saveData()
  }
  getDataFromLocal = async () =>{
    const mahalleler = await getter(this.fileName)
    this.response = mahalleler
  }
}
module.exports = Mahalle
