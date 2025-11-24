<script setup lang="ts">
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";

const assertionResultBadgeVariants = cva(
  "rounded-sm px-2 py-0.5 text-xs font-semibold border",
  {
    variants: {
      variant: {
        pass: "bg-emerald-100 text-emerald-900 border-emerald-200",
        fail: "bg-rose-100 text-rose-900 border-rose-200",
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
