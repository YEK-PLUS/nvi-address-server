const {
  ora,
} =require( './core/imports')
const controller = require('./middlewares/controller')
const writer = require('./middlewares/writer')
const getter = require('./middlewares/getter')
class Yapi {
  constructor(props) {
    this.props = props
  }

  controller = async (filename = this.mainFileName) =>{
    const fileExtend = `data/${this.constructorName}/`
    return await controller(`${fileExtend}${filename}`)
  }
  getter = async (filename = this.mainFileName) =>{
    const fileExtend = `data/${this.constructorName}/`
    return await getter(`${fileExtend}${filename}`)
  }
  writer = async (filename = this.mainFileName,data=this.response) =>{
    const fileExtend = `data/${this.constructorName}/`
    return await writer(`${fileExtend}${filename}`,data)
  }


  spinner = ora(`${this.constructorName} Aliniyor`).start()
  setData = async (parents=[]) =>{
    return this.parents = parents
  }
  saveData = async (filename=this.mainFileName,data=this.response) =>{
    return await this.writer(filename,data)
  }


  formatData = async(data = this.response)=>{
    const hub = {}
    await Promise.all(
      await data.map(async (e,i)=>{
        hub[e.kimlikNo] = (e)
      })
    )
    return hub
  }

  length = false
  getData = async () =>{
    if(!await this.controller(this.mainFileName)){
      this.response = await this.getDataFromNvi()
      // this.spinner.succeed(`${this.constructorName} alindi, kayit edildi`)
    }
    else{
      this.response = await this.getDataFromLocal()
      this.spinner.succeed(`${this.constructorName} kayitli dosyadan alindi`)
    }
  }
  getLength = async()=>{
    if (this.length) {
      return this.length
    }
    else{
      
    }
  }
  getNode = async (ilNo,ilceNo,mahalleNo,sokakNo)=>{
    const ilNode = await this.response[ilNo]
    const ilceNode = ilceNo ?
      await ilNode.ilceler[ilceNo] : undefined
    const mahalleNode = mahalleNo ?
      await ilceNode.mahalleler[mahalleNo] : undefined
    const sokakNode = sokakNo ?
      await mahalleNode.sokaklar[sokakNo] : undefined
    return sokakNode || mahalleNode || ilceNode || ilNode
  }

  looperCollector = async() => {
    if(!this.progress){
      this.progress = 0;
    }
    if(!this.totalLength){
      this.totalLength = 1;
    }
    const {parents} = this
    if (parents[0]) {
      const parentLength = await parents[0].getLength()
      for (var i = 0; i < parentLength +1 ; i++) {
        const parent = await parents[0].getNode(i)
        console.log(i);
      }
    }
    else{
      const data = await this.connector(this.path,{})
      this.spinner.text = (`${this.constructorName} Aliniyor | ${this.progress}/${this.totalLength}`)
      this.progress++
      length+= Object.keys(data).length
      return data
    }

  }
  connector = async(path,params) => {
    const {api} = this.props
    const data = (await api.post(path,params)).data
    const formattedData = await this.formatData(data)
    return formattedData
  }
  getDataFromNvi = async () =>{
    const data = await this.looperCollector()
    await this.saveData(undefined,data)
    return await data
  }
  getDataFromLocal = async () =>{
    return await this.getter(this.mainFileName)
  }
}
module.exports =  Yapi
