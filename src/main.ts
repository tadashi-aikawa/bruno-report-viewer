import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import { match } from "ts-pattern";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker: (_: any, label: string) =>
    match(label)
      .with("json", () => new jsonWorker())
      .otherwise(() => new editorWorker()),
};

createApp(App).mount("#app");
