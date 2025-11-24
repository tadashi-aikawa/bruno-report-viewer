/**
 * bru run の JSON レポート構造。`report.json` から推測した型。
 */

// 0番目のイテレーションのみを扱う. 実際は IterationReport[] が正しい
export type BrunoReport = [IterationReport];

export interface IterationReport {
  summary: Summary;
  results: Result[];

  // 0の場合のみを扱う
  iterationIndex: number;
}

export interface Summary {
  totalRequests: number;
  passedRequests: number;
  failedRequests: number;
  errorRequests: number;
  skippedRequests: number;
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalPreRequestTests: number;
  passedPreRequestTests: number;
  failedPreRequestTests: number;
  totalPostResponseTests: number;
  passedPostResponseTests: number;
  failedPostResponseTests: number;
}

export interface Result {
  test: TestFile;
  request: Request;
  response: Response;
  error: string | null;
  status: ResultStatus; // ここはテスト結果にかかわらずpass になる?
  testResults: AssertionResult[];

  // test以外は実装しない
  assertionResults: unknown[];
  preRequestTestResults: unknown[];
  postResponseTestResults: unknown[];

  /** 途中で実行が止まった場合に true になる */
  shouldStopRunnerExecution: boolean;

  runDuration: number;

  name: string;
  // 大体 nameと同じ?
  path: string;

  // 今は使っていない
  iterationIndex: number;
}
export type BRVStatus = "passed" | "failed" | "skipped";
export const Result = {
  toStatus(result: Result): BRVStatus {
    if (result.status === "skipped") {
      return "skipped";
    }
    const hasFailedAssertion = result.testResults.some(
      (ar) => ar.status === "fail",
    );
    return hasFailedAssertion ? "failed" : "passed";
  },
};

export interface TestFile {
  /** bruファイルの名称 */
  filename: string;
}

export interface Request {
  method: HttpMethod;
  url: string;
  headers: HeaderMap;
  data?: RequestBody;
}

export interface NonSkippedResponse {
  status: number;
  statusText: string;
  headers: HeaderMap;
  data: ResponseBody;
  responseTime: number;

  // WARN: ポート番号が入らないので使わないように
  // url: string;
}
export interface SkippedResponse {
  status: "skipped";
  statusText: string;
  responseTime: 0;
  data: null;
}
export type Response = NonSkippedResponse | SkippedResponse;

export interface AssertionResult {
  description: string;
  status: "pass" | "fail";
  error?: string;
  actual?: unknown;
  expected?: unknown;
  uid: string;
}

export type HeaderMap = Record<string, string>;

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | string;

export type RequestBody = string | Record<string, unknown> | unknown[] | null;

export type ResponseBody = string | Record<string, unknown> | unknown[];

/** スキップされなければpass */
export type ResultStatus = "pass" | "skipped";
// FIXME: リクエストに失敗したら fail になる可能性もある?
