<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Result } from "@/types/report";
import { ScrollArea } from "../ui/scroll-area";
import RequestContent from "./RequestContent.vue";
import ResponseContent from "./ResponseContent.vue";
import TestResultContent from "./TestResultContent.vue";

defineProps<{
  result: Result;
}>();
</script>

<template>
  <div class="flex h-[calc(100vh_-_var(--spacing-header))] flex-col gap-4">
    <Tabs
      default-value="test-results"
      class="flex h-full flex-col"
      v-slot="{ modelValue }"
    >
      <TabsList class="flex-none">
        <TabsTrigger value="test-results"> Test Results </TabsTrigger>
        <TabsTrigger value="response"> Response </TabsTrigger>
        <TabsTrigger value="request"> Request </TabsTrigger>
      </TabsList>

      <ScrollArea class="min-h-0 py-2">
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-125"
          enter-from-class="opacity-50"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-50"
        >
          <div :key="`${modelValue}-${result.path}`" class="space-y-4">
            <TabsContent value="test-results">
              <TestResultContent :results="result.testResults" />
            </TabsContent>
            <TabsContent value="response">
              <ResponseContent :response="result.response" />
            </TabsContent>
            <TabsContent value="request">
              <RequestContent :request="result.request" />
            </TabsContent>
          </div>
        </Transition>
      </ScrollArea>
    </Tabs>
  </div>
</template>
