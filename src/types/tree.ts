import type { Result } from "./report";

export type StatusCounts = {
  passed: number;
  failed: number;
  skipped: number;
  error: number;
};

export type TreeNode = {
  name: string;
  fullPath: string;
  children: TreeNode[];
  result?: Result;
  resultCount: number;
  statusCounts: StatusCounts;
};
