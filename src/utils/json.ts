import { match, P } from "ts-pattern";

const parseJsonIfPossible = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

type Json = string | Record<string, unknown> | unknown[];

export function prettifyJson(json: Json | null | undefined): string {
  return match(json)
    .with(P.nullish, () => "")
    .with(P.not(P.string), (data) => JSON.stringify(data, null, 2))
    .with(
      P.when((s) => !s.trim()),
      () => "",
    )
    .otherwise((s) => {
      const parsed = parseJsonIfPossible(s.trim());
      return typeof parsed === "string"
        ? parsed
        : JSON.stringify(parsed, null, 2);
    });
}

export function hasJsonHeader(
  json: Record<string, string> | null | undefined,
): boolean {
  return Object.keys(json ?? {}).length > 0;
}

export function hasJsonBody(json: Json | null | undefined): boolean {
  return match(json)
    .with(P.nullish, () => false)
    .with(P.string, (s) => s.trim().length > 0)
    .otherwise(() => true);
}
