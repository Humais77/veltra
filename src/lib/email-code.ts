import crypto from "crypto";

export function generateEmailCode(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export function hashEmailCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}

export function isCodeExpired(
  expiresAt: Date | null | undefined
): boolean {
  if (!expiresAt) {
    return true;
  }

  return expiresAt.getTime() <= Date.now();
}

export function canSendCode(
  lastSentAt: Date | null | undefined,
  cooldownSeconds = 60
): boolean {
  if (!lastSentAt) {
    return true;
  }

  const elapsed =
    Date.now() - lastSentAt.getTime();

  return elapsed >= cooldownSeconds * 1000;
}