import { NuxtAuthHandler } from '#auth';
import EmailProvider from 'next-auth/providers/email';
import faunadb from 'faunadb';
import { customFaunaAdapter } from '~/assets/js/customFaunaAdapter';

const {
  nextAuthSecret,
  faunaSecret,
  public: {
    isDeployed
  }
} = useRuntimeConfig();

const client = new faunadb.Client({
  secret: faunaSecret,
  scheme: 'https',
  domain: 'db.fauna.com',
  port: 443,
});

export default NuxtAuthHandler({
  debug: (isDeployed) ? false : true,
  secret: nextAuthSecret,
  pages: {
    signIn: `/auth/login`,
    // error: '/auth/error'
  },
  providers: [
    EmailProvider.default({
      id: 'whatsapp',
      type: 'email',
      maxAge: 60 * 10,
      generateVerificationToken: () => {

        return Math.floor(100000 + Math.random() * 900000);
      },
      normalizeIdentifier: (identifier) => {

        return identifier;
      },
      sendVerificationRequest: async ({ identifier, url, _provider, _theme }) => {

        try {

          const token = new URLSearchParams(url.split('?')[1]).get("token");

          // const {
          //   auth: {
          //     messageContent
          //   }
          // } = await useStorage('db').getItem(`${locale}.json`);
          const messageContent = `Your verification code is: *${token}*`;
         
          await $fetch(`/api/whatsapp/send-message/${identifier}`, {
            method: 'POST',
            body: {
              message: messageContent
            },
            headers: {
              'content-type': 'application/json',
              'authorization': `token ${nextAuthSecret}`
            }
          });
        } catch (error) {
          
          throw new Error(error);
        }
      }
    }),
  ],
  adapter: customFaunaAdapter(client),
});
