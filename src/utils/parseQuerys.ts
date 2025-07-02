export const parseEnumQuery = <T extends readonly string[]>(
  value: unknown,
  allowed: T
): T[number] | undefined => {
  return typeof value === "string" && allowed.includes(value)
    ? (value as T[number])
    : undefined;
};
