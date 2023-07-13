<script setup>
definePageMeta({
  auth: false,
});

const props = defineProps({
  error: Object,
  required: true,
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div>
    <div>Error Code: {{ error.statusCode }}</div>
    <div>Error Message: {{ error.statusMessage }}</div>
    <devOnly>
      <div>{{ error.stack }}</div>
    </devOnly>
    <div>
      <button @click="handleError">Go to the home page</button>
    </div>
  </div>
</template>

<style scoped>
div {
  padding: 1rem;
}
</style>