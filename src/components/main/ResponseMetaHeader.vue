<script setup lang="ts">
import type { ErrorResponse, HeaderMap, Response } from "@/types/report";
import { computed } from "vue";
import ResponseStatusBadge from "../ResponseStatusBadge.vue";

const props = defineProps<{
  response: Exclude<Response, ErrorResponse>;
}>();

const isSkipped = (response: Response) => response.status === "skipped";

const responseTimeMs = computed<number | null>(() =>
  isSkipped(props.response) ? null : props.response.responseTime,
);

const responseHeaders = computed<HeaderMap | null>(() =>
  isSkipped(props.response) ? null : props.response.headers,
);

const responseSizeKb = computed<number | null>(() => {
  const raw = responseHeaders.value?.["content-length"];
  if (!raw) {
    return null;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    return null;
  }
  const kb = parsed / 1024;
  return Math.round(kb * 100) / 100;
});
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 pt-1 pr-4">
    <div class="flex items-center gap-3">
      <ResponseStatusBadge
        :status="response.status"
        :status-text="response.statusText"
      />
    </div>
    <div
      class="text-muted-foreground flex flex-wrap items-center gap-4 text-xs"
    >
      <span v-if="responseTimeMs !== null">
        Time:
        <span class="text-foreground font-mono">{{ responseTimeMs }} ms</span>
      </span>
      <span v-if="responseSizeKb !== null">
        Size:
        <span class="text-foreground font-mono">{{ responseSizeKb }} KB</span>
      </span>
    </div>
  </div>
</template>
