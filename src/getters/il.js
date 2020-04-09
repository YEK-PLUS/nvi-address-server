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


class Il {
  constructor(props) {
    this.spinner = ora('Iller Aliniyor').start()
    this.props = props
    this.fileName = 'Iller'
  }
  setData = async () =>{}
  saveData = async () =>{
    writer(this.fileName,this.response)
  }
  getNode = async (n)=>{
    return this.response[n]
  }
  getLength = async ()=>{
    return Object.keys(this.response).length
  }
  getData = async () =>{
    if(!controller(this.fileName)){
      await this.getDataFromNvi()
      this.spinner.succeed('Iller alindi, kayit edildi')
    }
    else{
      await this.getDataFromLocal()
      this.spinner.succeed('Iller kayitli dosyadan alindi')
    }
  }
  formatData = async()=>{
    const hub = {}
    await Promise.all(
      await this.response.map(async (e,i)=>{
        hub[e.kimlikNo] = (e)
      })
    )
    return this.response = hub
  }
  getDataFromNvi = async () =>{
    const {api} = this.props
    this.spinner.text = (`Iller Aliniyor | Turkey`)
    const iller = (await api.post('ilListesi')).data
    this.response = iller
    await this.formatData()
    await this.saveData()
  }
  getDataFromLocal = async () =>{
    const iller = await getter(this.fileName)
    this.response = iller
  }
}
module.exports = Il
