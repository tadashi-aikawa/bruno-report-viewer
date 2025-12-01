<script setup lang="ts">
import type { Response } from "@/types/report";
import { hasJsonBody, hasJsonHeader, prettifyJson } from "@/utils/json";
import { FileBracesCornerIcon } from "lucide-vue-next";
import { computed } from "vue";
import CodeBlock from "../CodeBlock.vue";
import CodeBlockV2 from "../CodeBlockV2.vue";
import ResponseStatusBadge from "../ResponseStatusBadge.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const props = defineProps<{
  response: Response;
}>();

const isSkipped = (response: Response) => response.status === "skipped";

const hasHeaders = computed(() =>
  hasJsonHeader(isSkipped(props.response) ? null : props.response.headers),
);
const prettyJsonHeaders = computed(() =>
  prettifyJson(isSkipped(props.response) ? null : props.response.headers),
);

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
              <ResponseStatusBadge
                :status="response.status"
                :status-text="response.statusText"
              />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p v-if="!hasHeaders" class="text-muted-foreground text-sm">
              No headers
            </p>
            <CodeBlock v-else :content="prettyJsonHeaders" language="json" />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div class="bg-secondary/60 rounded-md border px-6 py-4">
        <div class="mb-3 flex items-center gap-2 text-sm font-semibold">
          <FileBracesCornerIcon class="inline-block size-4" />
          <span>Response Body</span>
        </div>
        <p v-if="!hasBody" class="text-muted-foreground text-sm">No body.</p>
        <CodeBlockV2 v-else :content="prettyResponseBody" language="json" />
      </div>
    </template>
  </div>
</template>
