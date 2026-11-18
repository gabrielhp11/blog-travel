import type { NextRequest } from "next/server";

type BodyResult = { ok: true; value: unknown } | { ok: false; tooLarge: boolean };

export async function readTextBody(request: NextRequest, maxBytes: number): Promise<{ ok: true; text: string } | { ok: false; tooLarge: boolean }> {
  const reader = request.body?.getReader();
  if (!reader) return { ok: false, tooLarge: false };
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      return { ok: false, tooLarge: true };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { ok: true, text: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
  } catch {
    return { ok: false, tooLarge: false };
  }
}

export async function readJsonBody(request: NextRequest, maxBytes: number): Promise<BodyResult> {
  const body = await readTextBody(request, maxBytes);
  if (!body.ok) return body;
  try {
    return { ok: true, value: JSON.parse(body.text) as unknown };
  } catch {
    return { ok: false, tooLarge: false };
  }
}
