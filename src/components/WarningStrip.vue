<script setup>
defineProps({
  tcws:     { type: Object, default: null },
  rainfall: { type: Object, default: null },
})
</script>

<template>
  <div class="warnings-strip">
    <div v-if="tcws" class="warning-pill warning-red">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="flex-shrink:0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/><path d="M12 7a5 5 0 010 10 5 5 0 010-10"/><path d="M12 9.5a2.5 2.5 0 000 5 2.5 2.5 0 000-5"/></svg>
      Typhoon Warning · Signal No. {{ tcws.signal }}
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" style="flex-shrink:0"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/></svg>
      {{ rainfall.alert }} Rainfall · {{ rainfall.text.toLowerCase() }}
    </div>
  </div>
</template>
