const {
  axios,
  urls,
  jssoup,
  cliProgress,
  ora,
  setCookie
} =require( '../core/imports')
const handleNviApiKey = async() => {
  const tokenSpinner = ora('Token Aliniyor').start()

  const mainReq = await axios.get(urls.mainPage)
  const soup = new jssoup(mainReq.data)
  const tokenSoup = soup.find('input',{'name':'__RequestVerificationToken'})
  const token = tokenSoup.attrs.value;
  tokenSpinner.succeed(`Token Bulundu >> ${token.substr(0,10)}..${token.substr(token.length-10,token.length)}`)

  const cookieSpinner = ora('Token Cerezleri Esitleniyor').start()
  const cookies = setCookie.parse(mainReq.headers['set-cookie']);
  const cookie = cookies[0].value;

  cookieSpinner.succeed(`Token Cerezleri Esitlendi >> ${cookie.substr(0,10)}..${cookie.substr(cookie.length-10,cookie.length)}`)

  return {
    token,
    cookie
  };
}

module.exports= handleNviApiKey
