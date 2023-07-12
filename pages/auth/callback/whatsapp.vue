<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: `/dashboard`,
  },
});

const {
  query: {
    callbackUrl
  }
} = useRoute();

navigateTo(`/${callbackUrl.split('/').slice(3).join('/')}`)
</script>