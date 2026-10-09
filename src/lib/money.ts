export function formatPKR(value: bigint | number | string) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function toBigIntAmount(value: unknown): bigint {
  if (typeof value === "bigint") return value;

  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new Error("Invalid amount");
    }

    return BigInt(value);
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return BigInt(value);
  }

  throw new Error("Invalid amount");
}

export function serializeBigInts<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, current) =>
      typeof current === "bigint" ? current.toString() : current
    )
  );
}