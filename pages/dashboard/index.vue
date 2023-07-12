<script setup>
const { status, data, signOut } = useAuth();

const user = ref(null);

const getUser = async () => {
  user.value = await $fetch('/api/dashboard/user', {
    credentials: 'include',
  });
};

const logOut = async () => {
  await signOut('whatsapp');
};
</script>

<template>
  <NuxtLayout>
    <h1>This is the dashboard</h1>
    <div>Status: {{ status }}</div>
    <div>Data: {{ data }}</div>
    <div>
      <button @click="getUser">Get user</button>
      {{ user }}
    </div>
    <div>
      <NuxtLink to="/">Go to home</NuxtLink>
      <button @click="logOut">logout</button>
    </div>
  </NuxtLayout>
</template>
