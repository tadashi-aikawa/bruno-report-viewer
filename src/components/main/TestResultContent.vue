<script setup lang="ts">
import AssertionResultBadge from "@/components/AssertionResultBadge.vue";
import type { AssertionResult } from "@/types/report";
import { CheckCircleIcon, XCircleIcon } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  results: AssertionResult[];
}>();

const failedResults = computed(() =>
  props.results.filter((x) => x.status === "fail"),
);
const passedResults = computed(() =>
  props.results.filter((x) => x.status === "pass"),
);
</script>

<template>
  <div class="space-y-4">
    <section class="space-y-2">
      <div class="flex items-center gap-2 text-sm font-semibold">
        <h2>Failed Assertions</h2>
        <AssertionResultBadge
          variant="fail"
          :status-count="failedResults.length"
        />
      </div>

      <p
        v-if="failedResults.length === 0"
        class="text-muted-foreground text-sm"
      >
        No failed assertions.
      </p>

      <div v-else class="space-y-2">
        <div
          v-for="result in failedResults"
          :key="result.uid"
          class="flex items-start gap-2"
        >
          <XCircleIcon
            class="text-destructive mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <div class="min-w-0 space-y-0.5">
            <p class="text-sm leading-tight break-words">
              {{ result.description }}
            </p>
            <p class="text-muted-foreground text-xs leading-tight break-words">
              {{ result.error }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-2">
      <div class="flex items-center gap-2 text-sm font-semibold">
        <h2>Passed Assertions</h2>
        <AssertionResultBadge
          variant="pass"
          :status-count="passedResults.length"
        />
      </div>

      <p
        v-if="passedResults.length === 0"
        class="text-muted-foreground text-sm"
      >
        No passed assertions.
      </p>

      <ul v-else class="space-y-2">
        <li
          v-for="result in passedResults"
          :key="result.uid"
          class="flex items-start gap-2"
        >
          <CheckCircleIcon
            class="mt-0.5 size-4 shrink-0 text-emerald-600"
            aria-hidden="true"
          />
          <p class="text-sm leading-tight break-words">
            {{ result.description }}
          </p>
        </li>
      </ul>
    </section>
  </div>
</template>
