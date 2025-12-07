const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildMatchers = (query: string): RegExp[] => {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return tokens.map((token) => {
    try {
      return new RegExp(token, "i");
    } catch {
      return new RegExp(escapeRegExp(token), "i");
    }
  });
};

export const matchesFields = (
  matchers: RegExp[],
  fields: Array<string | undefined | null>,
): boolean => {
  if (matchers.length === 0) {
    return true;
  }

  const safeFields = fields.filter(Boolean) as string[];
  if (safeFields.length === 0) {
    return false;
  }

  return matchers.every((matcher) =>
    safeFields.some((field) => matcher.test(field)),
  );
};
