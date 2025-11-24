<script setup lang="ts">
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";

const methodBadgeVariants = cva(
  "inline-flex items-center font-semibold uppercase",
  {
    variants: {
      variant: {
        get: "",
        post: "",
        put: "",
        patch: "",
        delete: "",
        default: "",
      },
      size: {
        sm: "text-[11px] leading-[1.1]",
        md: "text-xs leading-[1.2]",
      },
      tone: {
        filled: "rounded border shadow-none",
        text: "bg-transparent border-none px-0 py-0 shadow-none",
      },
    },
    compoundVariants: [
      { tone: "filled", size: "sm", class: "px-1.5 py-0.5" },
      { tone: "filled", size: "md", class: "px-2 py-1" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      tone: "filled",
    },
  },
);

type MethodBadgeVariants = VariantProps<typeof methodBadgeVariants>;

type MethodBadgeVariant = NonNullable<MethodBadgeVariants["variant"]>;
type MethodBadgeSize = NonNullable<MethodBadgeVariants["size"]>;
type MethodBadgeTone = NonNullable<MethodBadgeVariants["tone"]>;

const props = defineProps<{
  method: string;
  tone?: MethodBadgeTone;
  size?: MethodBadgeSize;
  class?: HTMLAttributes["class"];
}>();

const variant = computed<MethodBadgeVariant>(() => {
  const normalized = props.method?.toUpperCase() ?? "";
  const variants: Record<string, MethodBadgeVariants["variant"]> = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
  };
  return variants[normalized] ?? "default";
});

const tone = computed<MethodBadgeTone>(() => props.tone ?? "filled");

const filledPalette: Record<MethodBadgeVariant, string> = {
  get: "bg-emerald-100 text-emerald-900 border-emerald-200",
  post: "bg-blue-100 text-blue-900 border-blue-200",
  put: "bg-amber-100 text-amber-900 border-amber-200",
  patch: "bg-amber-100 text-amber-900 border-amber-200",
  delete: "bg-rose-100 text-rose-900 border-rose-200",
  default: "bg-muted text-foreground",
};

const textPalette: Record<MethodBadgeVariant, string> = {
  get: "text-emerald-700",
  post: "text-blue-700",
  put: "text-amber-700",
  patch: "text-amber-700",
  delete: "text-rose-700",
  default: "text-foreground",
};

const colorClass = computed(() => {
  const palette = tone.value === "text" ? textPalette : filledPalette;
  return palette[variant.value];
});
</script>

<template>
  <span
    :class="
      cn(
        methodBadgeVariants({
          variant,
          size: props.size,
          tone: tone,
        }),
        colorClass,
        props.class,
      )
    "
  >
    {{ method }}
  </span>
</template>
