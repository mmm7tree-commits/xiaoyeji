const ASSET_BASE_URL = typeof import.meta.env.VITE_ADMIN_ASSET_BASE_URL === "string"
  ? import.meta.env.VITE_ADMIN_ASSET_BASE_URL.trim()
  : "";

export function resolveAssetUrl(path: string) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (!ASSET_BASE_URL) {
    return path;
  }

  return `${ASSET_BASE_URL}${path}`;
}
