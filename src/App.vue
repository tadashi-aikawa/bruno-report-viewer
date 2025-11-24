<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { nextTick, onMounted, ref } from "vue";
import "vue-sonner/style.css";
import TheHeader from "./components/header/TheHeader.vue";
import TheMainContents from "./components/main/TheMainContents.vue";
import TheSideContents from "./components/side/TheSideContents.vue";
import { Spinner } from "./components/ui/spinner";
import { useReport } from "./composables/useReport";
import type { Result } from "./types/report";

const { report, fetchReport, loading } = useReport();
onMounted(async () => {
  await fetchReport();

  await nextTick();

  activeResult.value = report.value?.results[0] || null;
});

const activeResult = ref<Result | null>(null);
</script>

<template>
  <div v-if="loading" class="flex h-screen items-center justify-center">
    <Spinner class="text-secondary size-36" />
  </div>
  <div v-else>
    <div class="sticky top-0 z-10">
      <TheHeader />
    </div>

    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <TheSideContents
          v-if="report"
          :report="report"
          :active-result="activeResult"
          @click="(r) => (activeResult = r)"
          class="p-content"
        />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel>
        <TheMainContents
          v-if="activeResult"
          :result="activeResult"
          class="p-content"
        />
      </ResizablePanel>
    </ResizablePanelGroup>
    <Toaster />
  </div>
</template>
