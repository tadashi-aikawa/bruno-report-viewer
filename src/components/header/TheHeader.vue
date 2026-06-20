<script setup lang="ts">
defineProps<{ generatedAt: string | null }>();
</script>

<template>
  <div
    class="bg-primary text-primary-foreground h-header flex items-center gap-6 px-4"
  >
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Logo" class="size-10" />
      <h1 class="text-lg font-bold">Bruno Report Viewer</h1>
    </div>
    <div v-if="generatedAt" class="ml-auto text-sm opacity-80">
      Generated: {{ generatedAt }}
    </div>
  </div>
</template>
