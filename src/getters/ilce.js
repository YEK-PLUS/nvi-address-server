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
class Ilce {
  constructor(props) {
    this.spinner = ora('Ilceler Aliniyor').start()
    this.props = props
    this.fileName = 'Ilceler'
  }
  setData = async ({IlParent}) =>{
    this.props.IlParent = IlParent
  }
  saveData = async () =>{
    writer(this.fileName,this.response)
  }
  getNode = async (n,m)=>{
    return this.response[n].ilceler[m]
  }
  getNodes = async (n)=>{
    return this.response[n].ilceler
  }
  getLength = async ()=>{
    let length = 0
    const {response} = this
    Object.keys(response).forEach(function (il) {

      Object.keys(response[il].ilceler).forEach(function (ilce) {
      	length ++;
      });

    });
    return length
  }
  getParentNodeLength = async (i)=>{
    const nodes = await this.getNodes(i)
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
      this.spinner.succeed('Ilceler alindi, kayit edildi')
    }
    else{
      await this.getDataFromLocal()
      this.spinner.succeed('Ilcecler kayitli dosyadan alindi')
    }
  }
  looperCollector = async () => {
    const {IlParent,api} = this.props
    const length = await IlParent.getLength()
    const hub = []
    for (var i = 1; i < length+1; i++) {
      this.spinner.text = (`Ilceler Aliniyor | ${i}/${length}`)
      const il = await IlParent.getNode(i)
      const {kimlikNo} = il
      const data = await this.getter(il)
      const formattedData = await this.formatData(data)
      hub.push({kimlikNo,il,ilceler:{...formattedData}})
    }
    return await this.formatData(hub)
  }
  getter = async (e) =>{
    const {api} = this.props
    const ilceler = (
      await api.post('ilceListesi',{
        ilKimlikNo:e.kimlikNo
      })
    ).data
    return ilceler
  }
  getDataFromNvi = async () =>{
    const ilceler = await this.looperCollector()
    this.response = ilceler
    // await this.formatData()
    await this.saveData()
  }
  getDataFromLocal = async () =>{
    const iller = await getter(this.fileName)
    this.response = iller
  }
}
module.exports = Ilce
