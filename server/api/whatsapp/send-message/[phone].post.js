import { getClient } from '~/server/lib/whatsapp'

const { 
  mongodbUri
} = useRuntimeConfig();

let client, error;
getClient(mongodbUri)
  .then((res) => client = res)
  .catch(err => error = err)

export default eventHandler(async event => {

  if (error) {
    throw new Error(error);
  };
  
  const { message } = await readBody(event);
  const whatsapp = `${event.context.params.phone.replace('+','')}@c.us`;

  const state = await client.getState();

  if (state === 'CONNECTED') {
    const response = await client.sendMessage(whatsapp, message);

    if (response.id.fromMe) {
      return {
        status:'success',
        message:`Message successfully sent to ${whatsapp}`
      };
    };
  };

  throw new Error(error);
})