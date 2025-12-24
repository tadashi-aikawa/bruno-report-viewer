<script setup lang="ts">
import type { HeaderMap, NonErrorResponse, Response } from "@/types/report";
import { hasJsonBody, prettifyJson } from "@/utils/json";
import { FileBracesCornerIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import CodeBlockV2 from "../CodeBlockV2.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import HeadersTable from "./HeadersTable.vue";

const props = defineProps<{
  response: NonErrorResponse;
}>();

const isSkipped = (response: Response) => response.status === "skipped";

const responseHeaders = computed<HeaderMap | null>(() =>
  isSkipped(props.response) ? null : props.response.headers,
);
const hasHeaders = computed(
  () => Object.keys(responseHeaders.value ?? {}).length > 0,
);

const responseHeadersFilter = ref("");

const hasBody = computed(() => hasJsonBody(props.response.data));
const prettyResponseBody = computed(() => prettifyJson(props.response.data));
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="isSkipped(response)"
      class="bg-secondary/60 flex items-center gap-3 rounded-md border px-4 py-3"
    >
      <span class="text-foreground text-sm">{{ response.statusText }}</span>
    </div>

    <template v-if="!isSkipped(response)">
      <Accordion
        type="single"
        collapsible
        class="bg-secondary/60 rounded-md border px-6"
      >
        <AccordionItem value="headers">
          <AccordionTrigger class="group hover:no-underline">
            <div class="flex items-center gap-2">
              <FileBracesCornerIcon class="inline-block size-4" />
              <span class="group-hover:underline">Response Header</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p v-if="!hasHeaders" class="text-muted-foreground text-sm">
              No headers
            </p>
            <HeadersTable
              v-else
              v-model="responseHeadersFilter"
              :headers="responseHeaders ?? {}"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div class="bg-secondary/60 rounded-md border px-6 py-4">
        <div class="mb-3 flex items-center gap-2 text-sm font-semibold">
          <FileBracesCornerIcon class="inline-block size-4" />
          <span>Response Body</span>
        </div>
        <p v-if="!hasBody" class="text-muted-foreground text-sm">No body.</p>
        <CodeBlockV2
          v-else
          :content="prettyResponseBody"
          language="json"
          class="h-[calc(100vh_-_20rem)]"
        />
      </div>
    </template>
  </div>
</template>
