import { getClient } from '~/server/plugins/1.whatsappClient'

export default eventHandler(async event => {

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const client = getClient();
  console.log('client', client)
  
  const { message } = await readBody(event);
  const whatsapp = `${event.context.params.phone.replace('+','')}@c.us`;

  const state = await client.getState();
  try {
    const response = await client.sendMessage(whatsapp, message);

    if (response.id.fromMe) {
      return {
        status:'success',
        message:`Message successfully sent to ${whatsapp}`
      };
    };
  } catch (error) {
    console.log('NOT CONNECTED')
    throw new Error(error);
  }
})