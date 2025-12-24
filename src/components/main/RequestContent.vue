<script setup lang="ts">
import type { NonErrorRequest } from "@/types/report";
import { hasJsonBody, prettifyJson } from "@/utils/json";
import { FileBracesCornerIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import CodeBlock from "../CodeBlock.vue";
import MethodBadge from "../MethodBadge.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import HeadersTable from "./HeadersTable.vue";
import RequestQueryTable from "./RequestQueryTable.vue";

const props = defineProps<{
  request: NonErrorRequest;
}>();

const hasHeaders = computed(
  () => Object.keys(props.request.headers ?? {}).length > 0,
);

const hasBody = computed(() => hasJsonBody(props.request.data));
const prettyRequestBody = computed(() => prettifyJson(props.request.data));

const queryMap = computed(() => {
  const url = new URL(props.request.url);
  return Array.from(url.searchParams).reduce<{ [key: string]: string[] }>(
    (acc, [k, v]) => {
      (acc[k] ??= []).push(v);
      return acc;
    },
    {},
  );
});

const queryFilter = ref("");
const requestHeadersFilter = ref("");
</script>

<template>
  <div class="space-y-4">
    <Accordion
      type="single"
      collapsible
      class="bg-secondary/60 rounded-md border px-4"
    >
      <AccordionItem value="query">
        <AccordionTrigger>
          <div class="flex items-center gap-3">
            <MethodBadge :method="request.method" />
            <span class="text-foreground font-mono text-sm break-all">{{
              request.url
            }}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <RequestQueryTable v-model="queryFilter" :query-map="queryMap" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <Accordion
      type="single"
      collapsible
      class="bg-secondary/60 rounded-md border px-6"
    >
      <AccordionItem value="headers">
        <AccordionTrigger>
          <div>
            <FileBracesCornerIcon class="mr-2 inline-block size-4" />
            <span>Request Header</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <p v-if="!hasHeaders" class="text-muted-foreground text-sm">
            No headers.
          </p>
          <HeadersTable
            v-else
            v-model="requestHeadersFilter"
            :headers="request.headers ?? {}"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <div class="bg-secondary/60 rounded-md border px-6 py-4">
      <div class="mb-3 flex items-center gap-2 text-sm font-semibold">
        <FileBracesCornerIcon class="inline-block size-4" />
        <span>Request Body</span>
      </div>
      <p v-if="!hasBody" class="text-muted-foreground text-sm">No body.</p>
      <CodeBlock v-else :content="prettyRequestBody" language="json" />
    </div>
  </div>
</template>
