<script setup lang="ts">
import { Result, type IterationReport } from "@/types/report";
import { computed, ref, TransitionGroup, watch } from "vue";
import { ScrollArea } from "../ui/scroll-area";
import RequestResultSummary from "./RequestResultSummary.vue";
import SideContentHeader from "./SideContentHeader.vue";

const props = defineProps<{
  report: IterationReport;
}>();

const activeResult = defineModel<Result | null>("activeResult", {
  required: true,
});

const emit = defineEmits<{
  click: [result: Result];
}>();

const filterPassed = ref<boolean>(false);
const filterFailed = ref<boolean>(true);
const filterSkipped = ref<boolean>(false);

const filteredResults = computed(() => {
  return props.report.results.filter((x) => {
    const status = Result.toStatus(x);
    return (
      (status === "passed" && filterPassed.value) ||
      (status === "failed" && filterFailed.value) ||
      (status === "skipped" && filterSkipped.value)
    );
  });
});
watch(
  filteredResults,
  (newResults) => {
    const firstNewResult = newResults[0];

    if (!firstNewResult) {
      activeResult.value = null;
      return;
    }
    if (!activeResult.value) {
      activeResult.value = firstNewResult;
      return;
    }
    if (!newResults.includes(activeResult.value)) {
      activeResult.value = firstNewResult;
      return;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex h-[calc(100vh_-_var(--spacing-header))] flex-col gap-4">
    <SideContentHeader
      :summary="props.report.summary"
      v-model:filter-passed="filterPassed"
      v-model:filter-failed="filterFailed"
      v-model:filter-skipped="filterSkipped"
    />

    <ScrollArea class="min-h-0">
      <TransitionGroup
        name="request-list"
        tag="div"
        class="flex flex-col gap-2 px-0.5"
      >
        <RequestResultSummary
          v-for="(result, index) in filteredResults"
          :key="result.path ?? index"
          :result="result"
          :active="activeResult === result"
          @click="emit('click', result)"
        />
      </TransitionGroup>
    </ScrollArea>
  </div>
</template>

<style scoped>
.request-list-enter-active,
.request-list-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}
.request-list-enter-from,
.request-list-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
.request-list-enter-to,
.request-list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.request-list-move {
  transition: transform 220ms ease;
}
</style>
