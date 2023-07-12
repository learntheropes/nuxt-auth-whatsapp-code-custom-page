<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  },
});
const {
  query: {
    error
  }
} = useRoute();

let message;
if (error === 'Verification') {
  message = 'The sign in code is no longer valid.\n\nIt may have been used already or it may have expired.'
} else {
  message = 'Unknown error'
}
</script>

<template>
  <NuxtLayout>
    {{ message }}
  </NuxtLayout>
</template>