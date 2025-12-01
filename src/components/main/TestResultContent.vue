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

const isEqualAssertion = (result: AssertionResult) =>
  /^expected '[^']+' to equal '[^']+'$/.test(result.error || "");
const isLengthAssertion = (result: AssertionResult) =>
  /^expected \[[^\]]+\] to have a length of \d+ but got \d+$/.test(
    result.error || "",
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

            <div
              v-if="isEqualAssertion(result)"
              class="text-muted-foreground flex flex-wrap items-center gap-1 text-xs leading-tight break-words"
            >
              <span class="text-[11px] tracking-wide uppercase">expected</span>
              <span class="text-foreground font-medium">
                {{ result.expected }}
              </span>
              <span class="text-muted-foreground">·</span>
              <span class="text-[11px] tracking-wide uppercase">actual</span>
              <span class="text-foreground font-medium">
                {{ result.actual }}
              </span>
            </div>
            <div
              v-else-if="isLengthAssertion(result)"
              class="text-muted-foreground flex flex-wrap items-center gap-1 text-xs leading-tight break-words"
            >
              <span class="text-[11px] tracking-wide uppercase"
                >expected length</span
              >
              <span class="text-foreground font-medium">
                {{ result.expected }}
              </span>
              <span class="text-muted-foreground">·</span>
              <span class="text-[11px] tracking-wide uppercase"
                >actual length</span
              >
              <span class="text-foreground font-medium">
                {{ result.actual }}
              </span>
            </div>
            <p
              v-else
              class="text-muted-foreground text-xs leading-tight break-words"
            >
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
