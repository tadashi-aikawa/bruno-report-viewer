<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { Response } from "@/types/report";
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";

const responseStatusBadgeVariants = cva(
  "rounded border px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        success: "border-emerald-200",
        redirect: "border-violet-200",
        clientError: "border-amber-200",
        serverError: "border-red-200",
        skipped: "border-blue-200",
        default: "border-border",
      },
      tone: {
        filled: "",
        outline: "bg-transparent",
      },
    },
    // prettier-ignore
    compoundVariants: [
      // filled
      { variant: "success", tone: "filled", class: "bg-emerald-100 text-emerald-900", },
      { variant: "redirect", tone: "filled", class: "bg-violet-100 text-violet-900", },
      { variant: "clientError", tone: "filled", class: "bg-amber-100 text-amber-900", },
      { variant: "serverError", tone: "filled", class: "bg-red-100 text-red-900", },
      { variant: "skipped", tone: "filled", class: "bg-blue-100 text-blue-900", },
      { variant: "default", tone: "filled", class: "bg-muted text-foreground" },

      // outline
      { variant: "success", tone: "outline", class: "text-emerald-600 border-emerald-400", },
      { variant: "redirect", tone: "outline", class: "text-violet-600 border-violet-400", },
      { variant: "clientError", tone: "outline", class: "text-amber-600 border-amber-400", },
      { variant: "serverError", tone: "outline", class: "text-red-600 border-red-400", },
      { variant: "skipped", tone: "outline", class: "text-blue-600 border-blue-400", },
      { variant: "default", tone: "outline", class: "text-foreground", },
    ],
    defaultVariants: { variant: "default", tone: "filled" },
  },
);

type ResponseStatusBadgeVariants = VariantProps<
  typeof responseStatusBadgeVariants
>;

const props = defineProps<{
  status: Response["status"];
  statusText?: string;
  tone?: ResponseStatusBadgeVariants["tone"];
  class?: HTMLAttributes["class"];
}>();

const variant = computed<ResponseStatusBadgeVariants["variant"]>(() => {
  const status = props.status;
  if (status === "skipped") return "skipped";
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "clientError";
  if (status >= 500 && status < 600) return "serverError";
  return "default";
});

const label = computed(() => {
  return props.statusText
    ? `${props.status} ${props.statusText}`
    : String(props.status);
});
</script>

<template>
  <span
    :class="cn(responseStatusBadgeVariants({ variant, tone }), props.class)"
  >
    {{ label }}
  </span>
</template>
