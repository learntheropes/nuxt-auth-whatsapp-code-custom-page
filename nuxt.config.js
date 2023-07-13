const isDeployed = (
  process.env.AUTH_ORIGIN === 'http://localhost:3000'
  || !process.env.AUTH_ORIGIN
) ? false : true;
const deploymentDomain = process.env.AUTH_ORIGIN || 'http://localhost:3000';

export default defineNuxtConfig({
  runtimeConfig: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    faunaSecret: process.env.FAUNA_SECRET,
    mongodbUri: process.env.MONGODB_URI,
    telegramToken: process.env.TELEGRAM_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    public: {
      isDeployed,
      deploymentDomain,
    },
  },

  modules: [
    '@sidebase/nuxt-auth'
  ],

  auth: {
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: true
    },
    origin: deploymentDomain,
    baseUrl: `/api/auth`,
    addDefaultCallbackUrl: true,
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: true
    },
  }
});
