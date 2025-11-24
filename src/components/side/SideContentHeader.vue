<script setup lang="ts">
import type { Summary } from "@/types/report";
import { BadgeCheckIcon, CirclePauseIcon, OctagonXIcon } from "lucide-vue-next";
import StatusToggle from "./StatusToggle.vue";

defineProps<{
  summary: Summary;
}>();

const filterPassed = defineModel<boolean>("filter-passed", { required: true });
const filterFailed = defineModel<boolean>("filter-failed", { required: true });
const filterSkipped = defineModel<boolean>("filter-skipped", {
  required: true,
});
</script>

<template>
  <div class="flex flex-none items-center gap-2 text-lg">
    <StatusToggle
      v-if="summary.passedRequests > 0"
      v-model="filterPassed"
      label="Passed"
      :icon="BadgeCheckIcon"
      :count="summary.passedRequests"
      class="data-[state=on]:border-emerald-700 data-[state=on]:text-emerald-700"
    />
    <StatusToggle
      v-if="summary.failedRequests > 0"
      v-model="filterFailed"
      label="Failed"
      :icon="OctagonXIcon"
      :count="summary.failedRequests"
      class="data-[state=on]:border-destructive data-[state=on]:text-destructive"
    />
    <StatusToggle
      v-if="summary.skippedRequests > 0"
      v-model="filterSkipped"
      label="Skipped"
      :icon="CirclePauseIcon"
      :count="summary.skippedRequests"
      class="data-[state=on]:border-blue-700 data-[state=on]:text-blue-700"
    />
  </div>
</template>
