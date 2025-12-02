<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref } from "vue";

type Language = "json";

const props = defineProps<{
  content: string;
  language: Language;
}>();

const editorEl = ref<HTMLDivElement | null>(null);
onMounted(() => {
  monaco.editor.defineTheme("github-json", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "24292f" },
      { token: "string.key.json", foreground: "0550ae", fontStyle: "bold" },
      { token: "string", foreground: "0a3069" },
      { token: "number", foreground: "116329" },
      { token: "keyword.json", foreground: "cf222e", fontStyle: "bold" },
      { token: "operator", foreground: "57606a" },
      { token: "punctuation", foreground: "57606a" },
    ],
    colors: {
      "editor.background": "#f6f8fa",
      "editor.foreground": "#24292f",
      "editor.lineHighlightBackground": "#eaeef2",
      "editorLineNumber.foreground": "#8c959f",
      "editorLineNumber.activeForeground": "#24292f",
      "editorCursor.foreground": "#0969da",
      "editor.selectionBackground": "#cce5ff",
      "editor.inactiveSelectionBackground": "#e7f1fb",
      "editor.wordHighlightBackground": "#e2ecf7",
      "editorWhitespace.foreground": "#d0d7de",
      "editorIndentGuide.background": "#d8dee4",
      "editorIndentGuide.activeBackground": "#afb8c1",
    },
  });

  monaco.editor.create(editorEl.value!, {
    value: props.content,
    language: "json",
    automaticLayout: true,
    readOnly: true,
    theme: "github-json",
  });
});
</script>

<template>
  <div ref="editorEl"></div>
</template>
