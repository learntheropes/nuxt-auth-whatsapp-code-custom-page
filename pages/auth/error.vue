<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  }
});
const { query: { error } } = useRoute();

let message
switch(error) {
  case 'Configuration':
    message = 'There is a problem with the server configuration.\n\nCheck the server logs for more information.'
    break;
  case 'AccessDenied':
    message = 'You do not have permission to sign in.'
    break;
  case 'Verification':
    message = 'The sign in link is no longer valid.\n\nIt may have been used already or it may have expired.'
    break;
  default:
    message = 'Generic login error'
}
</script>

<template>
  <NuxtLayout>
    <div>
      <pre>{{ message }}</pre>
    </div>
  </NuxtLayout>
</template>