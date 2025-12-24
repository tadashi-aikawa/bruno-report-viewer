<script setup lang="ts">
import type { Summary } from "@/types/report";
import {
  BadgeCheckIcon,
  CircleOffIcon,
  FilterIcon,
  ListChevronsDownUpIcon,
  ListChevronsUpDown,
  OctagonXIcon,
} from "lucide-vue-next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import StatusToggle from "./StatusToggle.vue";

defineProps<{
  summary: Summary;
}>();

const filterPassed = defineModel<boolean>("filter-passed", { required: true });
const filterFailed = defineModel<boolean>("filter-failed", { required: true });
const filterSkipped = defineModel<boolean>("filter-skipped", {
  required: true,
});
const filterError = defineModel<boolean>("filter-error", { required: true });

const word = defineModel<string>("word", { required: true });

const emit = defineEmits<{
  clickExpandAll: [];
  clickCollapseAll: [];
}>();
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <div class="flex flex-1 flex-wrap items-center gap-4">
      <div class="flex items-center gap-2 text-lg">
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
          :icon="CircleOffIcon"
          :count="summary.skippedRequests"
          class="data-[state=on]:border-blue-700 data-[state=on]:text-blue-700"
        />
        <StatusToggle
          v-if="summary.errorRequests > 0"
          v-model="filterError"
          label="Error"
          :icon="OctagonXIcon"
          :count="summary.errorRequests"
          class="data-[state=on]:border-yellow-700 data-[state=on]:text-yellow-700"
        />
      </div>

      <div class="relative max-w-100 flex-1">
        <FilterIcon
          class="text-secondary-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2"
        />
        <Input
          v-model="word as string"
          type="search"
          placeholder="Filter (space-separated AND, regex supported)"
          class="pl-8"
        />
      </div>
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
