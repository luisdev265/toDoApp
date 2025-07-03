/**
 * Parses and validates a query or body value against a list of allowed enum values.
 *
 * @template T - A readonly array of allowed string values (enum-like).
 * @param {unknown} value - The value received from req.query or req.body.
 * @param {T} allowed - A readonly array of allowed string values (usually an array of enums).
 * @returns {T[number] | undefined} - The validated value if allowed, otherwise undefined.
 *
 * @example
 * const status = parseEnumQuery(req.query.status, ["pending", "completed"] as const);
 * if (status) {
 *   // status is now typed as "pending" | "completed"
 * }
 */

export const parseEnumQuery = <T extends readonly string[]>(
  value: unknown,
  allowed: T
): T[number] | undefined => {
  return typeof value === "string" && allowed.includes(value)
    ? (value as T[number])
    : undefined;
};
