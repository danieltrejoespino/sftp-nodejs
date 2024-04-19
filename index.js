const Client = require('ssh2-sftp-client')

const config = {
  host: '195.179.238.13',
  port: '65002', 
  username: 'u466684088',
  password: 'D123#$%67q'
}

const connSftp = async () => {
  const sftp = new Client()
  try {
    await sftp.connect(config)
    console.log('conexion exitosa',sftp.cwd())
    const listFiles = await sftp.list('/')
    console.log(listFiles);
    sftp.end()
  } catch (error) {
    console.log(error);
  }

  
  console.log('ddd');
}

connSftp()
