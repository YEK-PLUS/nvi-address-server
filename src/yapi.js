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
  getNode = async (numbers,data=this.response)=>{
    const a = numbers[0]
    const b = numbers[1]
    const c = numbers[2]
    const d = numbers[3]
    const e = numbers[4]
    console.log(data);
    const node = await data[a]
    if(node.childrens){
      return await this.getNode([b,c,d,e],node.childrens)
    }
    return node
  }

  looperCollector = async(params) => {
    const {parent,mahalle} = params || {}
    if(!this.progress){
      this.progress = 0;
    }
    if(!this.totalLength){
      this.totalLength = 1;
    }
    const {parents} = this
    var mainParent = parents.find(x=>x!==undefined);
    var mainParentIndex = parents.findIndex(x=>x===mainParent);
    parents.shift();
    if (mainParent) {
      const parentLength = await mainParent.getLength()
      this.totalLength= parentLength
      const hub = []
      for (var i = 1; i < parentLength +1 ; i++) {
        const node = await mainParent.getNode([i])
        const data = await this.looperCollector({parent:node})
        hub.push({parent:node,kimlikNo:node.kimlikNo,childrens:data})
      }
      return hub
    }
    else{
      const params = {};
      if (this.argument) {
        params[this.argument] = parent.kimlikNo
      }
      if(mahalle){
        params.mahalleKoyBaglisiListesi = mahalle.kimlikNo
      }
      const data = await this.connector(this.path,params)
      this.spinner.text = (`${this.constructorName} Aliniyor | ${this.progress}/${this.totalLength}`)
      this.progress++
      this.length+= Object.keys(data).length
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
    const formattedData = await this.formatData(data)
    await this.saveData(undefined,formattedData)
    return await data
  }
  getDataFromLocal = async () =>{
    return await this.getter(this.mainFileName)
  }
}
module.exports =  Yapi
