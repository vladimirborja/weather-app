<script setup>
defineProps({
  searchedCity: { type: String, default: '' },
})
</script>

<template>
  <div class="error-card">
    <div class="error-icon">⚠️</div>
    <div>
      <p class="error-title">City not found</p>
      <p class="error-sub">
        We couldn't find <strong>"{{ searchedCity }}"</strong>. Try one of the quick cities below.
      </p>
    </div>
  </div>
</template>
