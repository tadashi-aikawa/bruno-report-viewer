import { type BrunoReport, type IterationReport } from "@/types/report";
import { ref } from "vue";

export function useReport() {
  const report = ref<IterationReport | null>(null);
  const generatedAt = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchReport = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/report");
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }
      const lastModified = response.headers.get("Last-Modified");
      generatedAt.value = lastModified
        ? new Date(lastModified).toLocaleString()
        : null;
      const data: BrunoReport = await response.json();
      report.value = data[0];
    } catch (err: any) {
      error.value = err.message || "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  return { report, generatedAt, loading, error, fetchReport };
}
