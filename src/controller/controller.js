const Client = require('ssh2-sftp-client')
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');

const publicFolderPath = path.join(__dirname, '..', '..', 'public/tempLeads');

const config = {
  host: process.env.HOST_AMEX,
  username: process.env.USER_AMEX,
  password: process.env.PASS_AMEX
}

const sftp = new Client()
const actions = {
  saveLog : async(data) => {
    return data

  },
  openConn: async () => {
    try {
      await sftp.connect(config)
      // sftp.end()
      return true
    } catch (error) {
      // return error
      return false
    }
  },
  endConn: async () => {
    try {
      sftp.end()
    } catch (error) {
      return error
    }
  },
  searchLeads: async () => {
    try {
      const listFiles = await sftp.list('/outbox')
      if (listFiles.length < 1) {
        return 0
      }

      let total = 0

      for (const element of listFiles) {
        if (element.type === '-') {
          if (element.name.endsWith('.csv')) {
            const regex = /(WINBACK|CALLME)/;
            if (regex.test(element.name)) {

              console.log(`Archivo pertenece a digital ${element.name}`);

              const remoteFilePath = `/outbox/${element.name}`;
              const localFilePath = path.join(publicFolderPath, element.name);
              // await sftp.get(remoteFilePath, localFilePath);

              total++

            }
          }
        }
      }

      return total

    } // fin try

    catch (error) {
      return 0
    }
  },
  readLeads: async () => {    
    try {
      const archivos = await fs.promises.readdir(publicFolderPath);
      const lecturasPromesas = [];

      for (const archivo of archivos) {
        const rutaArchivo = path.join(publicFolderPath, archivo);
        const contenidoCSV = await fs.promises.readFile(rutaArchivo, 'utf-8');
        const streamLectura = fs.createReadStream(rutaArchivo);
    
        const lecturaPromise = new Promise((resolve, reject) => {
          streamLectura.pipe(csv())
            .on('data', (row) => {
              console.log(row);
              // let a = row[' Nombre'].replace(/\s/g, '').toUpperCase()
              
              // console.log(a); 
            })
            .on('end', () => {
              console.log(`Lectura del archivo ${archivo} completa`);
              resolve(); // Resuelve la promesa cuando la lectura del archivo se completa
            })
            .on('error', (error) => {
              console.error('Error al leer el archivo CSV:', error);
              reject(error); // Rechaza la promesa si hay un error en la lectura del archivo
            });
        });
    
        lecturasPromesas.push(lecturaPromise);
      }
      
      await Promise.all(lecturasPromesas);

      return true

    } catch (error) {
      console.error('Error al leer la carpeta:', error);
    }

  }

}

module.exports = actions


// vdgarcia@impulse-telecom.com
// Vg1r12Im9_0659




//!separar la higiene del proceso de insertar leads.


// Better Comments
