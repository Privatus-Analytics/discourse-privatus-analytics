// Builds the Privatus Analytics script tag from the theme settings.
// It has no Discourse imports, so it can be tested on its own.

export const DEFAULT_HOST = "privatusstats.com";
const SITE_ID = /^pa_[A-Za-z0-9]{1,64}$/;
const HOSTNAME =
  /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const MODULE = /^[a-z]{1,20}$/;

export function cleanSiteId(value) {
  const id = String(value || "").trim();
  return SITE_ID.test(id) ? id : null;
}

// Accepts "stats.example.com", "https://stats.example.com/" and the like.
// Returns null for anything that is not a plain hostname.
export function cleanHost(value) {
  const host = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  if (!host) {
    return null;
  }
  return HOSTNAME.test(host) ? host : null;
}

export function cleanModules(value) {
  return String(value || "")
    .split(",")
    .map((m) => m.trim().toLowerCase())
    .filter((m) => MODULE.test(m))
    .join(",");
}

// A list setting is stored as "a|b|c".
export function cleanPaths(value, prefix = "") {
  const base = String(prefix || "").replace(/\/+$/, "");
  return String(value || "")
    .split("|")
    .map((p) => p.trim())
    .filter((p) => p.startsWith("/") && !/[,\s"<>]/.test(p))
    .map((p) => (base && !p.startsWith(base + "/") ? base + p : p))
    .join(",");
}

// Who is left out: "nobody", "admins" or "staff" (admins and moderators).
export function shouldSkip(user, doNotCount) {
  if (!user) {
    return false;
  }
  if (doNotCount === "admins") {
    return !!user.admin;
  }
  if (doNotCount === "staff") {
    return !!(user.staff || user.admin || user.moderator);
  }
  return false;
}

// Returns the attributes of the script tag, or null when tracking is off.
export function scriptAttributes(settings, { basePath = "" } = {}) {
  const site = cleanSiteId(settings.site_id);
  if (!site) {
    return null;
  }
  const customHost = cleanHost(settings.script_domain);
  const host = customHost || DEFAULT_HOST;
  const attrs = {
    src: `https://${host}/js/pa.js`,
    "data-site": site,
    "data-modules": cleanModules(settings.modules),
  };
  if (customHost) {
    attrs["data-api"] = `https://${customHost}`;
  }
  const exclude = cleanPaths(settings.exclude_paths, basePath);
  if (exclude) {
    attrs["data-exclude"] = exclude;
  }
  if (settings.debug) {
    attrs["data-debug"] = "true";
  }
  return attrs;
}
