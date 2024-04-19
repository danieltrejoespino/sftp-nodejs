const Client = require('ssh2-sftp-client')
const path = require('path');

const config = {
  host: process.env.HOST_AMEX,  
  username: process.env.USER_AMEX,
  password: process.env.PASS_AMEX
}

const sftp = new Client()
const actions = {
  openConn : async () => {    
    try {
      await sftp.connect(config)
      // sftp.end()
      return true
    } catch (error) {
      // return error
      return false
    }
  },
  endConn : async () => {
    try {
      sftp.end()
    } catch (error) {
      return error
    }
  },
  searchLeads : async () => {
    try {
      const listFiles = await sftp.list('/outbox') 
      if (listFiles.length < 1 ) {
        return 'sin datos'
      }      

      const publicFolderPath = path.join(__dirname, '..', '..', 'public');
      let total =0
      
      for (const element of listFiles) {
        if (element.type === '-') {
          if (element.name.endsWith('.csv')) {
            const regex = /(WINBACK|CALLME)/;
            if (regex.test(element.name)) {

              console.log(`Archivo pertenece a digital ${element.name}`);
              
              const remoteFilePath = `/outbox/${element.name}`;
              const localFilePath = path.join(publicFolderPath, element.name);
              // await sftp.get(remoteFilePath, localFilePath);

              total ++

            }
          }
        }
      }

      return total
      
    } // fin try
    
    catch (error) {      
      return error
    }
  }

}

module.exports = actions


// vdgarcia@impulse-telecom.com

// Vg1r12Im9_0659