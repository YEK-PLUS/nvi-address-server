const {
  axios,
  urls,
  jssoup,
  cliProgress,
  ora
} =require( '../core/imports')
const createNviBackDoor = async(token) => {
  const nviSpinner = ora('NVI Arka Kapi Olusturuluyor').start()
  const {baseURL,mainPage} = urls
  const instance = axios.create({
    baseURL,
    timeout:100000,
    headers:{
      '__RequestVerificationToken':token.token,
      'Cookie':`__RequestVerificationToken=${token.cookie}`,
      'Referer':mainPage,
      'X-Requested-With':'XMLHttpRequest'
    }
  });
  nviSpinner.text = 'Arka Kapi Test Ediliyor'

  const test= await instance.post('ilListesi');
  if(test.data.success == false){
    nviSpinner.fail('Arka Kapi Olusturma Basarisiz Oldu')
  }
  else{
    nviSpinner.succeed('Arka Kapi Olusturma Basarili Oldu')
  }

  return instance
}

module.exports= createNviBackDoor
