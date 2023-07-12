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
    // callback: `/auth/callback/whatsapp`,
    error: '/auth/error'
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

        // const {
        //   auth: {
        //     messageContent
        //   }
        // } = await useStorage('db').getItem(`${locale}.json`);
        const messageContent = 'Your verification code is:';

        const token = new URLSearchParams(url.split('?')[1]).get("token");

        try {
         
          await $fetch(`/api/whatsapp/send-message/${identifier}`, {
            method: 'POST',
            body: {
              message: `${messageContent} *${token}*`
            },
            headers: {
              'content-type': 'application/json',
              'authorization': `token ${nextAuthSecret}`
            }
          });
        } catch (error) {

          throw createError(error);
        }
      }
    }),
  ],
  adapter: customFaunaAdapter(client),
});
