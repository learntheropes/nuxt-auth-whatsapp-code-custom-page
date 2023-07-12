<script setup>
definePageMeta({
  auth: false,
});
</script>

<template>
  <NuxtLayout>
    <h1>This is the home</h1>
    <div>
      <NuxtLink to="/dashboard">Go to dashboard</NuxtLink>
    </div>
  </NuxtLayout>
</template>
