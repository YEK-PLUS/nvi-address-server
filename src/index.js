const handleNviApiKey  =require( './middlewares/handleNviApiKey')
const createNviBackDoor  =require( './middlewares/createNviBackDoor')
const getterInstance = require('./getters')
const app = async() => {
  const nviApiKey = await handleNviApiKey()
  const api = await createNviBackDoor(nviApiKey)

  const getter = await getterInstance(api)
}

module.exports = app
