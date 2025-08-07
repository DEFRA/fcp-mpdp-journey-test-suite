import ZapClient from 'zaproxy'

const zapOptions = {
  proxy: {
    host: 'localhost',
    port: '8080'
  }
}

export const zapClient = new ZapClient(zapOptions)
