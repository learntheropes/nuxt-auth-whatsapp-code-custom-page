import whatsappWeb from 'whatsapp-web.js';
const { Client, RemoteAuth } = whatsappWeb
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import QRCode from 'qrcode';

let client;
const defineNitroPlugin = async () => {

  const { 
    mongodbUri
  } = useRuntimeConfig();

  await mongoose.connect(mongodbUri);

  const store = new MongoStore({ mongoose });
  
  client = new Client({
    puppeteer: {
      headless: true,
      args: ['--no-sandbox'],
      // executablePath: '/usr/bin/chromium-browser'
    },
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 1000 * 60 * 5,
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
    throw createError({
      statusMessage: `Authentication failure: ${msg}`,
      statusCode: 500,
    });
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

  console.log('INITIALIZED');

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const recursive = async () => {
    let state;
    try {
      state = await client.getState();
    } catch (error) {
      console.log('WAITING FOR STATE');
      await sleep(1000);
      await recursive();
    }
    if (state === 'CONNECTED') {
      console.log('RETURNING CLIENT');
      return client;
    }
    else {
      console.log('WAITING ON STATE', state);
      await sleep(1000);
      await recursive();
    }
  }

  await recursive();
}

const getClient = () => {
  return client;
};

export { defineNitroPlugin as default, getClient };