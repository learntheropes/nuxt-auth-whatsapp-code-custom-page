import whatsappWeb from 'whatsapp-web.js';
const { Client, RemoteAuth } = whatsappWeb
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import chromium from 'chrome-aws-lambda';

export const getClient = async (mongodbUri) => {

  let client;
  try {

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    await mongoose.connect(mongodbUri);
  
    const store = new MongoStore({ mongoose });
    
    client = new Client({
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
        // headless: chromium.headless,
        // args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        ignoreHTTPSErrors: true,
      },
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 60000,
        dataPath: './temp/'
      })
    });
  
  } catch (error) {

    throw new Error(error);
  }

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
    throw createError({
      statusMessage: `Disconnected: ${reason}`,
      statusCode: 500,
    });
    await sleep(1000 * 5);
    client.initialize();
  });
  
  client.on('ready', async () => {
    console.log('CONNECTED');
  });

  return client;
}