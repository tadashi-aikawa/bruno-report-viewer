<script setup lang="ts">
import { buildMatchers, matchesFields } from "@/utils/search";
import { FilterIcon } from "lucide-vue-next";
import { computed } from "vue";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const props = defineProps<{
  queryMap: Record<string, string[]>;
}>();

const filter = defineModel<string>({ default: "" });

type QueryRow = {
  key: string;
  values: string[];
};

const rows = computed<QueryRow[]>(() =>
  Object.entries(props.queryMap ?? {}).map(([key, values]) => ({
    key,
    values,
  })),
);

const filteredRows = computed(() => {
  const trimmed = filter.value.trim();
  if (!trimmed) {
    return rows.value;
  }

  const matchers = buildMatchers(trimmed);

  return rows.value.filter((row) => {
    return matchesFields(matchers, [row.key, row.values.join("&")]);
  });
});
</script>

<template>
  <div class="space-y-3">
    <div v-if="rows.length === 0" class="text-muted-foreground text-sm">
      No query parameters.
    </div>

    <div v-else>
      <div class="relative max-w-200">
        <FilterIcon
          class="text-secondary-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2"
        />
        <Input
          v-model="filter as string"
          type="search"
          placeholder="Filter (space-separated AND, regex supported)"
          class="h-8 pl-8 text-xs"
        />
      </div>
      <Table class="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead class="w-40">Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="filteredRows.length > 0">
            <TableRow v-for="row in filteredRows" :key="row.key">
              <TableCell class="font-mono">
                {{ row.key }}
              </TableCell>
              <TableCell class="font-mono">
                <span v-if="row.values.length === 1">
                  {{ row.values[0] }}
                </span>
                <span v-else>
                  {{ row.values.join(", ") }}
                </span>
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableEmpty :colspan="2">
              <span class="text-muted-foreground text-sm">
                No query parameters match the filter.
              </span>
            </TableEmpty>
          </template>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
