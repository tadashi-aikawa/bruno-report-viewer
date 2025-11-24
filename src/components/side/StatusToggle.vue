<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { Component, HTMLAttributes } from "vue";
import { Toggle } from "../ui/toggle";

const props = defineProps<{
  label: string;
  icon: Component;
  count: number;
  class?: HTMLAttributes["class"];
}>();

const active = defineModel<boolean>({ required: true });
</script>

<template>
  <Toggle
    :class="
      cn(
        'data-[state=off]:text-muted-foreground/40 flex cursor-pointer items-center gap-1 border border-transparent px-2.5 py-1.5 text-base',
        props.class,
      )
    "
    size="sm"
    v-model="active"
  >
    <component :is="icon" class="shrink-0" aria-hidden="true" />
    <span class="leading-none font-semibold">{{ count }}</span>
    <span class="text-sm leading-none">{{ label }}</span>
  </Toggle>
</template>
