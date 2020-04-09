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
class Sokak {
  constructor(props) {
    this.spinner = ora('Sokaklar Aliniyor').start()
    this.props = props
    this.fileName = 'Sokaklar'
  }
  errorCount = 0
  fixedErrorCount = 0
  setData = async ({IlParent,IlceParent,MahalleParent}) =>{
    this.props.IlParent = IlParent
    this.props.IlceParent = IlceParent
    this.props.MahalleParent = MahalleParent
  }
  saveData = async (filename = this.filename,data = this.response) =>{
    writer(filename,data)
  }
  getNode = async (n,m,p,r)=>{
    return this.response[n].ilceler[m].mahalleler[p].sokaklar[r]
  }
  getNodes = async (n,m,p)=>{
    return this.response[n].ilceler[m].mahalleler[p].sokaklar
  }
  getLength = async ()=>{
    let length = 0
    const {response }= this
    Object.keys(response).forEach(function (il) {

      Object.keys(response[il].ilceler).forEach(function (ilce) {

        Object.keys(response[il].ilceler[ilce].mahalleler).forEach(function (mahalle) {

          Object.keys(response[il].ilceler[ilce].mahalleler[mahalle].sokaklar).forEach(function (sokak) {
          	length ++;
          });

        });

      });

    });
    return length
  }
  getParentNodeLength = async (n,m,p)=>{
    const nodes = await this.getNodes(n,m,p)
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
      this.spinner.succeed('Sokaklar alindi, kayit edildi')
    }
    else{
      await this.getDataFromLocal()
      this.spinner.succeed('Sokaklar kayitli dosyadan alindi')
    }
  }
  looperCollector = async () => {
    const {IlceParent,MahalleParent,IlParent,api} = this.props

    const totalMahalleLength = await MahalleParent.getLength()
    let totalMahalleProgress = 0



    const ilLength = await IlParent.getLength()

    const hub = []

    for (var ilNumber = 1; ilNumber < ilLength+1; ilNumber++) {

      const ilceLength = await IlceParent.getParentNodeLength(ilNumber)
      const il = await IlParent.getNode(ilNumber)

      const ilHub = []

      for (var ilceNumber = 1; ilceNumber < ilceLength+1; ilceNumber++) {

        const ilce = await IlceParent.getNode(ilNumber,ilceNumber)
        const mahalleLength = await MahalleParent.getParentNodeLength(ilNumber,ilceNumber)

        const ilceHub = []

        for (var mahalleNumber = 1; mahalleNumber < mahalleLength+1; mahalleNumber++) {

          const mahalle = await MahalleParent.getNode(ilNumber,ilceNumber,mahalleNumber)
          this.console(totalMahalleProgress,totalMahalleLength)

          const data = await this.getter(mahalle)

          const formattedData = await this.formatData(data)
          const {kimlikNo} = mahalle
          ilceHub.push({kimlikNo,mahalle,sokaklar:{...formattedData}})

          totalMahalleProgress++;

        }

        const formattedIlceHub = await this.formatData(ilceHub)
        const {kimlikNo} = ilce
        ilHub.push({kimlikNo,ilce,mahalleler:{...formattedIlceHub}})

      }
      const formattedIlHub = await this.formatData(ilHub)
      const {kimlikNo} = il
      const ilData = {kimlikNo,il,ilceler:{...formattedIlHub}}
      this.saveData(`${il.kimlikNo}-sokaklar`,ilData)
      hub.push(ilData)

    }


    return await this.formatData(hub)
  }
  console = (now,total) => {
    const text = `Sokaklar Aliniyor | ${now}/${total}`
    const errorExtendion = `Hata Sayisi ${this.errorCount}`
    const fixedErrorExtendion = `Duzeltilen Hata Sayisi ${this.fixedErrorCount}`
    this.spinner.text = `${text} ${errorExtendion} ${fixedErrorExtendion}`

  }
  getter = async (e) =>{
    const {api} = this.props
    try {
      const sokaklar = (
        await api.post('yolListesi',{
          mahalleKoyBaglisiKimlikNo:e.kimlikNo
        })
      ).data
      return sokaklar
    } catch {
      this.errorCount ++;
      const sokaklar = await this.getter(e)
      this.fixedErrorCount ++;
      return sokaklar
    }
  }
  getDataFromNvi = async () =>{
    const sokaklar = await this.looperCollector()
    this.response = sokaklar
    // await this.formatData()
    await this.saveData()
  }
  getDataFromLocal = async () =>{
    const sokaklar = await getter(this.fileName)
    this.response = sokaklar
  }
}
module.exports = Sokak
