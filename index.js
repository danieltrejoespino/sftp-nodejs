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
          const read = await actions.readLeads();
        } else {
          console.log('sin leads operativos para insertar')
        }
    }else{      
      //guardar logs
      actions.saveLog('sin conexion con serv amex')
    }
    
  } catch (error) {
    console.log(error)
    // process.exit(1);
  }
}
//?PROCESO PRINCIPAL
// run()

async function test() {
  const log = await actions.saveLog('sin conexion con serv amex')
  console.log(log);
  const read = await actions.readLeads();
  console.log(read);
  
}

test()