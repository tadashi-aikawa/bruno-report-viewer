<script setup lang="ts">
import { sleep } from "@/utils/os";
import { CheckIcon, CopyIcon } from "lucide-vue-next";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { computed, ref } from "vue";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Language = "json";

const props = defineProps<{
  content: string;
  language: Language;
}>();

const copied = ref(false);

const highlighted = computed(() =>
  // 色を付ける. 色以外はclassのCSSで指定
  Prism.highlight(
    props.content,
    Prism.languages[props.language]!,
    props.language,
  ),
);
const className = computed(() => `language-${props.language}`);

const handleCopy = async () => {
  await navigator.clipboard.writeText(props.content);

  copied.value = true;
  await sleep(1000);
  copied.value = false;
};
</script>

<template>
  <div class="relative">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger class="absolute top-2 right-2">
          <Button variant="ghost" @click="handleCopy">
            <CopyIcon v-if="!copied" class="size-4" />
            <CheckIcon v-else class="size-4" /> </Button
        ></TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <pre
      v-html="highlighted"
      :class="className"
      style="font-size: 0.8rem"
    ></pre>
  </div>
</template>
