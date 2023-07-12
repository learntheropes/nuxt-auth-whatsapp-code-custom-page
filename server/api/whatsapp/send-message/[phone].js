import { getClient } from '~/server/lib/whatsapp'

const { 
  mongodbUri
} = useRuntimeConfig();

let client;
getClient(mongodbUri).then((res) => client = res);

export default eventHandler(async event => {
  
  const body = await readBody(event);
  const whatsapp = `${event.context.params.phone.replace('+','')}@c.us`;

  const state = await client.getState();

  if (state === 'CONNECTED') {
    const response = await client.sendMessage(whatsapp, body.message);

    if (response.id.fromMe) {
      return {
        status:'success',
        message:`Message successfully sent to ${whatsapp}`
      };
    };
  };

  throw createError({
    statusMessage: 'State not connected',
    statusCode: 500,
  });
})