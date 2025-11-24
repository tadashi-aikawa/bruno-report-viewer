<script setup lang="ts">
import { Result, type IterationReport } from "@/types/report";
import { computed, ref, TransitionGroup } from "vue";
import { ScrollArea } from "../ui/scroll-area";
import RequestResultSummary from "./RequestResultSummary.vue";
import SideContentHeader from "./SideContentHeader.vue";

const props = defineProps<{
  report: IterationReport;
  activeResult: Result | null;
}>();

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
</script>

<template>
  <div
    class="flex h-[calc(100vh_-_var(--spacing-header))] flex-col gap-4 overflow-hidden"
  >
    <SideContentHeader
      :summary="props.report.summary"
      v-model:filter-passed="filterPassed"
      v-model:filter-failed="filterFailed"
      v-model:filter-skipped="filterSkipped"
    />

    <ScrollArea class="min-h-0 flex-1">
      <TransitionGroup
        name="request-list"
        tag="div"
        class="flex flex-col gap-2 px-0.5"
      >
        <RequestResultSummary
          v-for="(result, index) in filteredResults"
          :key="result.path ?? index"
          :result="result"
          :active="props.activeResult === result"
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
