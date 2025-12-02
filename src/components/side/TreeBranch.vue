<script setup lang="ts">
import type { Result } from "@/types/report";
import type { TreeNode } from "@/types/tree";
import { FilterIcon, FolderClosed, FolderOpen } from "lucide-vue-next";
import { computed, TransitionGroup } from "vue";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import RequestResultSummary from "./RequestResultSummary.vue";

defineOptions({ name: "TreeBranch" });

const {
  node,
  depth = 0,
  activeResult,
} = defineProps<{
  node: TreeNode;
  depth?: number;
  activeResult: Result | null;
}>();

const emit = defineEmits<{
  select: [result: Result];
  clickFilter: [path: string];
}>();

const handleSelect = (result: Result) => emit("select", result);

type StatusKey = keyof TreeNode["statusCounts"];
const statusOrder: StatusKey[] = ["passed", "failed", "skipped"];
const statusBadgeStyles: Record<StatusKey, string> = {
  passed: "border-emerald-200 bg-emerald-100 text-emerald-800",
  failed: "border-rose-200 bg-rose-100 text-rose-800",
  skipped: "border-blue-200 bg-blue-100 text-blue-800",
};

const hasChildren = computed(() => node.children.length > 0);
const paddingStyle = computed(() => ({
  paddingLeft: `${depth * 12 + 4}px`,
}));
const visibleStatuses = computed<StatusKey[]>(() =>
  statusOrder.filter((statusKey) => node.statusCounts[statusKey] > 0),
);
</script>

<template>
  <AccordionItem v-if="hasChildren" :value="node.fullPath" class="border-none">
    <AccordionTrigger
      class="group flex items-center justify-start gap-2 py-2 pr-2 text-sm leading-tight"
      :style="paddingStyle"
    >
      <FolderClosed
        class="text-muted-foreground size-4 shrink-0 group-data-[state=open]:hidden"
        aria-hidden
      />
      <FolderOpen
        class="text-muted-foreground hidden size-4 shrink-0 group-data-[state=open]:block"
        aria-hidden
      />
      <span class="truncate">{{ node.name }}</span>

      <div class="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          class="opacity-0 group-hover:opacity-100"
          @click.stop="emit('clickFilter', node.fullPath)"
        >
          <FilterIcon class="text-muted-foreground size-4" aria-hidden />
        </Button>
        <Badge
          v-for="statusKey in visibleStatuses"
          :key="statusKey"
          variant="outline"
          :class="statusBadgeStyles[statusKey]"
        >
          {{ node.statusCounts[statusKey] }}
        </Badge>
      </div>
    </AccordionTrigger>
    <AccordionContent class="py-1 pl-1">
      <TransitionGroup
        name="request-list"
        tag="div"
        class="flex flex-col gap-2"
      >
        <TreeBranch
          v-for="child in node.children"
          :key="child.fullPath"
          :node="child"
          :depth="depth + 1"
          :active-result="activeResult"
          @select="handleSelect"
          @click-filter="emit('clickFilter', $event)"
        />
      </TransitionGroup>
    </AccordionContent>
  </AccordionItem>

  <div v-else-if="node.result" :style="paddingStyle" class="flex flex-col">
    <RequestResultSummary
      :result="node.result"
      :active="activeResult === node.result"
      @click="handleSelect(node.result)"
    />
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
