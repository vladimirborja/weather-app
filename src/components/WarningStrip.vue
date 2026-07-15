<script setup>
defineProps({
  tcws:     { type: Object, default: null },
  rainfall: { type: Object, default: null },
})
</script>

<template>
  <div class="warnings-strip">
    <div v-if="tcws" class="warning-pill warning-red">
      🌀 Typhoon Warning · Signal No. {{ tcws.signal }}
    </div>
    <div
      v-if="rainfall"
      class="warning-pill"
      :class="{
        'warning-red':    rainfall.alert === 'Red',
        'warning-orange': rainfall.alert === 'Orange',
        'warning-yellow': rainfall.alert === 'Yellow',
      }"
    >
      🌧️ {{ rainfall.alert }} Rainfall · {{ rainfall.text.toLowerCase() }}
    </div>
  </div>
</template>
