<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  }
});

const {
  query: {
    callbackUrl
  }
} = useRoute();

const {
  public: {
    deploymentDomain
  }
} = useRuntimeConfig();

const { signIn } = useAuth();

const phone = ref(null);
const showPhone = ref(true);
const token = ref(null);

const sendWhatsapp = async () => {
  try {

    await signIn('whatsapp', {
      email: phone.value,
      redirect: false,
      callbackUrl: `/dashboard`,
    });

    showPhone.value = false
  } catch (error) {

    throw createError(error);
  }
};
const verifyCode = () => {

  const route = `/api/auth/callback/whatsapp?callbackUrl=${encodeURIComponent(callbackUrl)}&token=${encodeURIComponent(token.value)}&email=${encodeURIComponent(phone.value)}`;
  
  navigateTo(`${deploymentDomain}${route}`, {
    external: true,
    redirectCode: 200
  });
}
</script>

<template>
  <NuxtLayout>
    <h1>Login</h1>
    <form v-if="showPhone" @submit.prevent="sendWhatsapp">
      <input v-model="phone" />
      <input type="submit" value="Send wa" />
    </form>
    <form v-else @submit.prevent="verifyCode">
      <input v-model="token" />
      <input type="submit" value="Verify code" />
    </form>
  </NuxtLayout>
</template>