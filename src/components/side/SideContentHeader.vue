<script setup lang="ts">
import type { Summary } from "@/types/report";
import {
  BadgeCheckIcon,
  CirclePauseIcon,
  ListChevronsDownUpIcon,
  ListChevronsUpDown,
  OctagonXIcon,
} from "lucide-vue-next";
import { Button } from "../ui/button";
import StatusToggle from "./StatusToggle.vue";

defineProps<{
  summary: Summary;
}>();

const filterPassed = defineModel<boolean>("filter-passed", { required: true });
const filterFailed = defineModel<boolean>("filter-failed", { required: true });
const filterSkipped = defineModel<boolean>("filter-skipped", {
  required: true,
});

const emit = defineEmits<{
  clickExpandAll: [];
  clickCollapseAll: [];
}>();
</script>

<template>
  <div class="flex flex-none items-center justify-between">
    <div class="flex gap-2 text-lg">
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

    <div class="flex justify-end gap-2 px-1">
      <Button variant="outline" size="icon" @click="emit('clickExpandAll')">
        <ListChevronsUpDown />
      </Button>
      <Button variant="outline" size="icon" @click="emit('clickCollapseAll')">
        <ListChevronsDownUpIcon />
      </Button>
    </div>
  </div>
</template>
