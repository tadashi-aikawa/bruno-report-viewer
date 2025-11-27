<script setup lang="ts">
import { Result, type IterationReport } from "@/types/report";
import { FolderClosed, FolderOpen } from "lucide-vue-next";
import {
  computed,
  defineComponent,
  h,
  ref,
  TransitionGroup,
  watch,
  type PropType,
  type VNode,
} from "vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import RequestResultSummary from "./RequestResultSummary.vue";
import SideContentHeader from "./SideContentHeader.vue";

const props = defineProps<{
  report: IterationReport;
}>();

const activeResult = defineModel<Result | null>("activeResult", {
  required: true,
});

const emit = defineEmits<{
  click: [result: Result];
}>();

const filterPassed = ref<boolean>(true); // FIXME:
const filterFailed = ref<boolean>(true);
const filterSkipped = ref<boolean>(false);
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

type StatusCounts = {
  passed: number;
  failed: number;
  skipped: number;
};

type TreeNode = {
  name: string;
  fullPath: string;
  children: TreeNode[];
  result?: Result;
  resultCount: number;
  statusCounts: StatusCounts;
};

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

const TreeBranch = defineComponent({
  name: "TreeBranch",
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
    activeResult: {
      type: Object as PropType<Result | null>,
      default: null,
    },
  },
  emits: ["select"],
  setup(props, { emit }) {
    const handleSelect = (result: Result) => emit("select", result);

    const statusOrder: Array<keyof StatusCounts> = [
      "passed",
      "failed",
      "skipped",
    ];
    const statusBadgeStyles: Record<keyof StatusCounts, string> = {
      passed:
        "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-50",
      failed:
        "border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-50",
      skipped:
        "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/20 dark:text-blue-50",
    };
    const renderStatusBadges = () => {
      const badges: VNode[] = [];
      statusOrder.forEach((status) => {
        const count = props.node.statusCounts[status];
        if (count === 0) return;

        badges.push(
          h(
            Badge,
            {
              key: status,
              variant: "outline",
              class: statusBadgeStyles[status],
            },
            () => count,
          ),
        );
      });
      return badges;
    };

    const renderChildren = () =>
      h(
        TransitionGroup,
        {
          name: "request-list",
          tag: "div",
          class: "flex flex-col gap-2",
        },
        () =>
          props.node.children.map((child) =>
            h(TreeBranch, {
              key: child.fullPath,
              node: child,
              depth: props.depth + 1,
              activeResult: props.activeResult,
              onSelect: handleSelect,
            }),
          ),
      );

    return () => {
      const hasChildren = props.node.children.length > 0;

      if (hasChildren) {
        return h(
          AccordionItem,
          {
            value: props.node.fullPath,
            class: "border-none",
          },
          {
            default: () => [
              h(
                AccordionTrigger,
                {
                  class:
                    "group flex items-center justify-start gap-2 py-2 pr-2 text-sm leading-tight",
                  style: { paddingLeft: `${props.depth * 12 + 4}px` },
                },
                () => [
                  h(FolderClosed, {
                    class:
                      "text-muted-foreground size-4 shrink-0 group-data-[state=open]:hidden",
                    "aria-hidden": true,
                  }),
                  h(FolderOpen, {
                    class:
                      "text-muted-foreground size-4 shrink-0 hidden group-data-[state=open]:block",
                    "aria-hidden": true,
                  }),
                  h("span", { class: "truncate" }, props.node.name),
                  h(
                    "div",
                    { class: "ml-auto flex items-center gap-1" },
                    renderStatusBadges(),
                  ),
                ],
              ),
              h(
                AccordionContent,
                {
                  class: "pl-1 py-1",
                },
                {
                  default: () => renderChildren(),
                },
              ),
            ],
          },
        );
      }

      if (!props.node.result) return null;

      return h(
        "div",
        {
          style: { paddingLeft: `${props.depth * 12 + 4}px` },
          class: "flex flex-col",
        },
        [
          h(RequestResultSummary, {
            result: props.node.result,
            active: props.activeResult === props.node.result,
            onClick: () => handleSelect(props.node.result as Result),
          }),
        ],
      );
    };
  },
});
</script>

<template>
  <div class="flex h-[calc(100vh_-_var(--spacing-header))] flex-col gap-4">
    <SideContentHeader
      :summary="props.report.summary"
      v-model:filter-passed="filterPassed"
      v-model:filter-failed="filterFailed"
      v-model:filter-skipped="filterSkipped"
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
