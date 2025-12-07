import { describe, expect, it } from "vitest";
import { buildMatchers, matchesFields } from "./search";

describe("buildMatchers の動作", () => {
  it("空白区切りのトークンを大文字小文字無視で正規表現化する", () => {
    const [foo, bar] = buildMatchers("Foo  bar");

    expect(foo!.test("foo")).toBe(true);
    expect(bar!.test("BARBAZ")).toBe(true);
  });

  it("不正な正規表現はエスケープして扱う", () => {
    const [matcher] = buildMatchers("(abc");

    expect(matcher!.source).toBe("\\(abc");
    expect(matcher!.test("(abc")).toBe(true);
  });
});

describe("matchesFields の動作", () => {
  it("マッチャーが空なら常に true を返す", () => {
    expect(matchesFields([], ["foo"])).toBe(true);
  });

  it("すべてのマッチャーが少なくとも1つのフィールドに合致する必要がある", () => {
    const matchers = buildMatchers("foo bar");

    expect(matchesFields(matchers, ["foo path", "bar path"])).toBe(true);
    expect(matchesFields(matchers, ["only foo"])).toBe(false);
  });

  it("フィールドが空なら false を返す", () => {
    const matchers = buildMatchers("foo");

    expect(matchesFields(matchers, [null, undefined])).toBe(false);
  });

  it("正規表現の OR 指定を許容する", () => {
    const matchers = buildMatchers("foo|bar");

    expect(matchesFields(matchers, ["baz bar"])).toBe(true);
  });
});
