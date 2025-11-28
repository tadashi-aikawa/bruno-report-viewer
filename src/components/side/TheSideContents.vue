<script setup lang="ts">
import { Result, type IterationReport } from "@/types/report";
import type { StatusCounts, TreeNode } from "@/types/tree";
import { computed, onMounted, ref, watch } from "vue";
import { Accordion } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import SideContentHeader from "./SideContentHeader.vue";
import TreeBranch from "./TreeBranch.vue";

const props = defineProps<{
  report: IterationReport;
}>();

const activeResult = defineModel<Result | null>("activeResult", {
  required: true,
});

const emit = defineEmits<{
  click: [result: Result];
}>();

const filterPassed = ref<boolean>(false);
const filterFailed = ref<boolean>(true);
const filterSkipped = ref<boolean>(false);
const word = ref("");
const expandedItems = ref<string[]>([]);

const filteredResults = computed(() => {
  return props.report.results.filter((x) => {
    const status = Result.toStatus(x);
    return (
      (status === "passed" && filterPassed.value) ||
      (status === "failed" && filterFailed.value) ||
      (status === "skipped" && filterSkipped.value)
    );
  });
});
watch(
  filteredResults,
  (newResults) => {
    const firstNewResult = newResults[0];

    if (!firstNewResult) {
      activeResult.value = null;
      return;
    }
    if (!activeResult.value) {
      activeResult.value = firstNewResult;
      return;
    }
    if (!newResults.includes(activeResult.value)) {
      activeResult.value = firstNewResult;
      return;
    }
  },
  { immediate: true },
);

type BuildNode = {
  name: string;
  fullPath: string;
  children: BuildNode[];
  childrenMap: Map<string, BuildNode>;
  result?: Result;
  resultCount: number;
  statusCounts: StatusCounts;
};

const buildTree = (results: Result[]): TreeNode[] => {
  const root: BuildNode = {
    name: "",
    fullPath: "",
    children: [],
    childrenMap: new Map(),
    resultCount: 0,
    statusCounts: { passed: 0, failed: 0, skipped: 0 },
  };

  const createNode = (name: string, fullPath: string): BuildNode => ({
    name,
    fullPath,
    children: [],
    childrenMap: new Map(),
    resultCount: 0,
    statusCounts: { passed: 0, failed: 0, skipped: 0 },
  });

  results.forEach((result) => {
    const segments = (result.path ?? "")
      .split("/")
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (segments.length === 0) {
      segments.push(result.path ?? "(root)");
    }

    let parent = root;
    segments.forEach((segment, index) => {
      const currentPath = segments.slice(0, index + 1).join("/");
      const existing = parent.childrenMap.get(currentPath);

      if (existing) {
        parent = existing;
        return;
      }

      const node = createNode(segment, currentPath);
      parent.childrenMap.set(currentPath, node);
      parent.children.push(node);
      parent = node;
    });

    parent.result = result;
  });

  const computeResultCount = (node: BuildNode): StatusCounts => {
    const childCounts = node.children.map(computeResultCount);
    const totals: StatusCounts = { passed: 0, failed: 0, skipped: 0 };

    childCounts.forEach((count) => {
      totals.passed += count.passed;
      totals.failed += count.failed;
      totals.skipped += count.skipped;
    });

    if (node.result) {
      const status = Result.toStatus(node.result);
      totals[status] += 1;
    }

    node.statusCounts = totals;
    node.resultCount = totals.passed + totals.failed + totals.skipped;
    return totals;
  };

  root.children.forEach(computeResultCount);

  const stripLookup = (node: BuildNode): TreeNode => ({
    name: node.name,
    fullPath: node.fullPath,
    children: node.children.map(stripLookup),
    result: node.result,
    resultCount: node.resultCount,
    statusCounts: node.statusCounts,
  });

  return root.children.map(stripLookup);
};

const treeResults = computed(() => buildTree(filteredResults.value));

const expandableValues = computed(() => {
  const collect = (nodes: TreeNode[], acc: string[]): void => {
    nodes.forEach((node) => {
      if (node.children.length > 0) {
        acc.push(node.fullPath);
        collect(node.children, acc);
      }
    });
  };

  const values: string[] = [];
  collect(treeResults.value, values);
  return values;
});

watch(
  treeResults,
  () => {
    const allowed = new Set(expandableValues.value);
    expandedItems.value = expandedItems.value.filter((value) =>
      allowed.has(value),
    );
  },
  { immediate: true },
);

const expandAll = () => {
  expandedItems.value = [...expandableValues.value];
};

const collapseAll = () => {
  expandedItems.value = [];
};

onMounted(() => {
  expandAll();
});
</script>

<template>
  <div class="flex h-[calc(100vh_-_var(--spacing-header))] flex-col gap-4">
    <SideContentHeader
      :summary="props.report.summary"
      v-model:filter-passed="filterPassed"
      v-model:filter-failed="filterFailed"
      v-model:filter-skipped="filterSkipped"
      v-model:word="word"
      @clickExpandAll="expandAll"
      @clickCollapseAll="collapseAll"
    />

    <ScrollArea class="min-h-0 pr-4">
      <Accordion
        v-model="expandedItems as string[]"
        type="multiple"
        collapsible
      >
        <TreeBranch
          v-for="node in treeResults"
          :key="node.fullPath"
          :node="node"
          :active-result="activeResult"
          @select="emit('click', $event)"
        />
      </Accordion>
    </ScrollArea>
  </div>
</template>
