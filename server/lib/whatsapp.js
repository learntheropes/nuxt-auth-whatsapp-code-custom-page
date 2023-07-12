import wa from 'whatsapp-web.js';
const { Client, RemoteAuth } = wa
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

export const getClient = async (mongodbUri) => {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  await mongoose.connect(mongodbUri);

  const store = new MongoStore({ mongoose });
  
  const client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox']
    },
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 60000,
      dataPath: './temp/'
    })
  });

  client.initialize();

  client.on('qr', async (qr) => {
    const qrcode = await QRCode.toString(qr,{
      type: 'terminal',
      small: true
    });
    console.log(qrcode);
    await sendTelegram(qr);
  });
  
  client.on('authenticated', () => {
    console.log('AUTHENTICATED');
  });
  
  client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
  });
  
  client.on('change_state', async (state) => {
    console.log(state);
  });
  
  client.on('disconnected', async (reason) => {
    console.log('DISCONNECTED: ', reason);
    await sleep(1000 * 5);
    client.initialize();
  });
  
  client.on('ready', async () => {
    console.log('CONNECTED');
  });

  return client;
}