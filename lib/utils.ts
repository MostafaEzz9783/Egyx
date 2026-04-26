import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function sanitizeText(value: FormDataEntryValue | string | null | undefined) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMultiline(value: FormDataEntryValue | string | null | undefined) {
  return String(value ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .trim();
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-SA").format(value);
}

export function formatYear(value: number) {
  return new Intl.NumberFormat("ar-SA", { useGrouping: false }).format(value);
}

export function buildPageNumbers(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page > 0 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function hashIp(value: string) {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return `h${(hash >>> 0).toString(16)}`;
}

export function isSafeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    return ["https:"].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

export function parsePage(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseOptionalNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function absoluteUrl(path = "") {
  const base = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}
