/**
 * Minimal clsx — join truthy class name values.
 */
type ClassValue = string | number | false | null | undefined | Record<string, unknown> | ClassValue[];

export default function clsx(...args: ClassValue[]): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string" || typeof a === "number") {
      out.push(String(a));
    } else if (Array.isArray(a)) {
      const inner = clsx(...a);
      if (inner) out.push(inner);
    } else if (typeof a === "object") {
      for (const k of Object.keys(a)) {
        if ((a as Record<string, unknown>)[k]) out.push(k);
      }
    }
  }
  return out.join(" ");
}
