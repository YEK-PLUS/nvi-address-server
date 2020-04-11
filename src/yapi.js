const {
  ora,
} =require( './core/imports')
const controller = require('./middlewares/controller')
const writer = require('./middlewares/writer')
const getter = require('./middlewares/getter')
class Yapi {
  constructor(props) {
    this.props = props
    if(!this.progress){
      this.progress = 0;
    }
    if(!this.errorCount){
      this.errorCount = 0;
    }
    if(!this.fixedErrorCount){
      this.fixedErrorCount = 0;
    }
    if(!this.totalLength){
      this.totalLength = 1;
    }
    this.spinner = ora(`${this.constructorName} Aliniyor`).start()
  }

  controller = async (filename = this.mainFileName) =>{
    const fileExtend = `data/${this.constructorName}/`
    return await controller(`${fileExtend}${filename}`)
  }
  getter = async (filename = this.mainFileName) =>{
    const fileExtend = `data/${this.constructorName}/`
    return await getter(`${fileExtend}${filename}`)
  }
  writer = async (filename = this.mainFileName,data=this.response,prefix="") =>{
    const fileExtend = `data/${this.constructorName}/`
    return await writer(`${fileExtend}${prefix}${filename}`,data)
  }


  setData = async (parents={}) =>{
    return this.parents = parents
  }
  saveData = async (filename=this.mainFileName,data=this.response) =>{
    return await this.writer(filename,data)
  }


  formatData = async(data = this.response)=>{
    const hub = {}
    await Promise.all(
      await data.map(async (e,i)=>{
        hub[e.ilKayitNo||i+1] = (e)
      })
    )
    return hub
  }
  console = (push=true) => {
    let {progress,totalLength,errorCount,fixedErrorCount,constructorName} = this
    if (push) {
      this.progress++;
    }
    const text = `${constructorName} Aliniyor | ${progress}/${totalLength}`
    const errorExtendion = `Hata Sayisi ${errorCount}`
    const fixedErrorExtendion = `Duzeltilen Hata Sayisi ${fixedErrorCount}`
    this.spinner.text = `${text} ${errorExtendion} ${fixedErrorExtendion}`

  }
  length = false
  getData = async () =>{
    if(!await this.controller(this.mainFileName)){
      this.response = await this.getDataFromNvi()
      this.spinner.succeed(`${this.constructorName} alindi, kayit edildi`)
    }
    else{
      this.response = await this.getDataFromLocal()
      this.spinner.succeed(`${this.constructorName} kayitli dosyadan alindi`)
    }
  }
  getLength = async(node=this.response)=>{
    if (this.length) {
      return this.length
    }
    else{
      let length = 0;

         await Object.keys(node).forEach(async (childrens) => {
          if (childrens.childrens) {
              const childrenLength = await this.getLength(childrens.childrens)
              length += childrenLength
          }
          else{
            length++;
          }
        })

      return length;
    }
  }
  connector = async(params,formatted=true) => {
    const {path} = this
    const {api} = this.props
    try {
      const data = (await api.post(path,params)).data
      const formattedData = await this.formatData(data)
      return formatted?formattedData:data
    } catch (e) {
      this.errorCount ++;
      const data = await this.connector(params,false)
      const formattedData = await this.formatData(data)
      this.fixedErrorCount++;
      return formatted?formattedData:data
    }
  }
  getDataFromNvi = async () => {
    const data = await this.looperCollector()
    await this.saveData(undefined,data)
    return await data
  }
  getDataFromLocal = async () =>{
    return await this.getter(this.mainFileName)
  }
}
module.exports =  Yapi
