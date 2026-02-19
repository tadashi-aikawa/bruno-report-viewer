<script setup lang="ts">
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";

const assertionResultBadgeVariants = cva(
  "rounded-sm border px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        pass: "border-emerald-200 bg-emerald-100 text-emerald-900",
        fail: "border-rose-200 bg-rose-100 text-rose-900",
      },
    },
  },
);

type AssertionResultBadgeVariants = VariantProps<
  typeof assertionResultBadgeVariants
>;
type AssertionResultBadgeVariant = NonNullable<
  AssertionResultBadgeVariants["variant"]
>;

const props = defineProps<{
  variant: AssertionResultBadgeVariant;
  statusCount: number;
  class?: HTMLAttributes["class"];
}>();

const label = computed(() => props.statusCount);
</script>

<template>
  <span :class="cn(assertionResultBadgeVariants({ variant }), props.class)">
    {{ label }}
  </span>
</template>
