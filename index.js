require('dotenv').config();
const actions = require('./src/controller/controller')

async function run() {
  try {
    const isConnected = await actions.openConn();
    if (isConnected) {
      console.log('conectado a amex')
      const getLeads = await actions.searchLeads();
        
        if (getLeads > 1) {
          console.log('insertar leads')
        } else {
          console.log('sin leads operativos para insertar')
        }
    }else{
      console.log('no conectado')
      //guardar logs
    }
    
  } catch (error) {
    console.log(error)
    // process.exit(1);
  }
}

run()