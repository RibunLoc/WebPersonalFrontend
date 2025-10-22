export type PresignResponse = {
  uploadUrl?: string;
  url?: string;
  method?: string;
  headers?: Record<string, string | number | boolean>;
  fields?: Record<string, string | number>;
  assetUrl?: string;
  publicUrl?: string;
  objectUrl?: string;
  cdnUrl?: string;
  path?: string;
  key?: string;
  finalUrl?: string;
};

export const normalizeHeaderValues = (
  headers: Record<string, string | number | boolean> = {}
) =>
  Object.entries(headers).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = String(value);
    }
    return acc;
  }, {});

export const buildPublicUrl = (uploadUrl: string, presign: PresignResponse) => {
  if (presign.assetUrl) return presign.assetUrl;
  if (presign.publicUrl) return presign.publicUrl;
  if (presign.objectUrl) return presign.objectUrl;
  if (presign.cdnUrl) return presign.cdnUrl;
  if (presign.finalUrl) return presign.finalUrl;
  if (presign.path) {
    const base = uploadUrl.replace(/\/?$/, "");
    const path = String(presign.path).replace(/^\/+/, "");
    return `${base}/${path}`;
  }
  if (presign.key) {
    const base = uploadUrl.replace(/\/?$/, "");
    const key = String(presign.key).replace(/^\/+/, "");
    return `${base}/${key}`;
  }
  if (presign.fields?.key !== undefined) {
    const base = uploadUrl.replace(/\/?$/, "");
    const fieldKey = String(presign.fields.key).replace(/^\/+/, "");
    return `${base}/${fieldKey}`;
  }
  const sanitized = uploadUrl.split("?")[0];
  return sanitized;
};
