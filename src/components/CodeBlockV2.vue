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
  monaco.editor.defineTheme("solarized-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "93a1a1" },
      { token: "string", foreground: "2aa198" },
      { token: "number", foreground: "d33682" },
      { token: "keyword", foreground: "859900" },
      { token: "identifier", foreground: "268bd2" },
      { token: "type", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
      { token: "variable", foreground: "657b83" },
      { token: "regexp", foreground: "2aa198" },
      { token: "operator", foreground: "859900" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#657b83",
      "editor.lineHighlightBackground": "#eee8d5",
      "editorCursor.foreground": "#657b83",
      "editorWhitespace.foreground": "#eee8d5",
      "editorIndentGuide.background": "#eee8d5",
      "editor.selectionBackground": "#eee8d5",
    },
  });

  monaco.editor.create(editorEl.value!, {
    value: props.content,
    language: "json",
    automaticLayout: true,
    readOnly: true,
    theme: "solarized-light",
  });
});
</script>

<template>
  <div ref="editorEl"></div>
</template>
