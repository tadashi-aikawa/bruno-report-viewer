<script setup lang="ts">
import * as monaco from "monaco-editor";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { onMounted, ref } from "vue";

type Language = "json";

const props = defineProps<{
  content: string;
  language: Language;
}>();

const editorEl = ref<HTMLDivElement | null>(null);
onMounted(() => {
  const editor = monaco.editor.create(editorEl.value!, {
    value: props.content,
    language: "json",
    automaticLayout: true,
    readOnly: true,
  });
});
</script>

<template>
  <div ref="editorEl" class="h-[calc(100vh_-_300px)]"></div>
</template>
