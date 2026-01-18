import manifestJson from "../generated/spaces-manifest.json";

const manifestEntries = Object.entries(
  (manifestJson ?? {}) as Record<string, string>
).map(([key, url]) => [
  key.replace(/^\.\//, ""),
  url,
]);

const manifestMap = new Map<string, string>();
for (const [rawKey, value] of manifestEntries) {
  const normalized = rawKey.replace(/^\/+/, "");
  manifestMap.set(normalized, value);
  manifestMap.set(`/${normalized}`, value);
}

const isRemoteUrl = (value: string) =>
  /^(?:https?:)?\/\//i.test(value) || value.startsWith("data:");

export const resolveAssetUrl = (input?: string | null): string => {
  if (!input) return "";

  if (isRemoteUrl(input)) return input;

  const normalized = input.replace(/^\.\//, "");
  const fromManifest = manifestMap.get(normalized) || manifestMap.get(`/${normalized}`);

  if (fromManifest) return fromManifest;

  return input;
};

export type SpacesManifest = typeof manifestJson;
