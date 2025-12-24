<script setup lang="ts">
import { Result } from "@/types/report";
import {
  BadgeCheckIcon,
  CircleOffIcon,
  OctagonXIcon,
  SkullIcon,
} from "lucide-vue-next";
import { match } from "ts-pattern";
import { computed } from "vue";
import MethodBadge from "../MethodBadge.vue";
import ResponseStatusBadge from "../ResponseStatusBadge.vue";

const props = defineProps<{
  result: Result;
  active?: boolean;
}>();

const testStatus = computed(() => Result.toStatus(props.result));

const statusMeta = computed(() =>
  match(testStatus.value)
    .with("passed", () => ({
      label: "Passed",
      icon: BadgeCheckIcon,
      baseClass:
        "bg-emerald-50/10 hover:bg-emerald-100/45 border-emerald-100 dark:bg-emerald-500/8 dark:hover:bg-emerald-500/16",
      activeClass:
        "bg-emerald-100 dark:bg-emerald-500/25 border-emerald-200 dark:border-emerald-500/40",
      barClass: "bg-emerald-400",
      class:
        "text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-500/40",
    }))
    .with("failed", () => ({
      label: "Failed",
      icon: OctagonXIcon,
      baseClass:
        "bg-rose-50/10 hover:bg-rose-100/45 border-rose-100 dark:bg-rose-500/8 dark:hover:bg-rose-500/16",
      activeClass:
        "bg-rose-100 dark:bg-rose-500/25 border-rose-200 dark:border-rose-500/40",
      barClass: "bg-destructive",
      class: "text-destructive ring-destructive/30 dark:bg-destructive/20",
    }))
    .with("skipped", () => ({
      label: "Skipped",
      icon: CircleOffIcon,
      baseClass:
        "bg-blue-50/10 hover:bg-blue-100/45 border-blue-100 dark:bg-blue-500/8 dark:hover:bg-blue-500/16",
      activeClass:
        "bg-blue-100 dark:bg-blue-500/25 border-blue-200 dark:border-blue-500/40",
      barClass: "bg-blue-400",
      class:
        "text-blue-800 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-50 dark:ring-blue-500/30",
    }))
    .with("error", () => ({
      label: "Error",
      icon: SkullIcon,
      baseClass:
        "bg-yellow-50/10 hover:bg-yellow-100/45 border-yellow-100 dark:bg-yellow-500/8 dark:hover:bg-yellow-500/16",
      activeClass:
        "bg-yellow-100 dark:bg-yellow-500/25 border-yellow-200 dark:border-yellow-500/40",
      barClass: "bg-yellow-400",
      class:
        "text-yellow-800 ring-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-50 dark:ring-yellow-500/30",
    }))
    .exhaustive(),
);
</script>

<template>
  <button
    class="group relative flex cursor-pointer flex-col gap-2 border transition"
    :class="{
      [statusMeta.baseClass]: !active,
      [statusMeta.activeClass]: active,
    }"
  >
    <div
      class="absolute inset-y-0 w-1 rounded-full opacity-80 transition group-hover:opacity-100"
      :class="statusMeta.barClass"
      aria-hidden="true"
    />
    <div class="p-1 pl-4">
      <div class="flex items-center gap-2">
        <div :class="statusMeta.class">
          <component :is="statusMeta.icon" class="size-5" aria-hidden="true" />
        </div>
        <div class="text-foreground truncate text-sm font-semibold">
          {{ result.name }}
        </div>
        <ResponseStatusBadge
          class="ml-auto"
          :status="result.response.status"
          tone="outline"
        />
      </div>
      <div
        v-if="result.request.method !== null"
        class="text-muted-foreground flex items-center gap-2 text-xs"
      >
        <MethodBadge :method="result.request.method" size="sm" tone="text" />
        <div class="truncate">
          {{ result.request.url }}
        </div>
      </div>
      <div v-else class="text-destructive flex truncate text-xs">
        {{ result.error }}
      </div>
    </div>
  </button>
</template>
