export function getApiErrorMessage(
  err: any,
  fallback = "Something went wrong. Please try again."
): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  const data = err.data ?? err.response?.data;

  if (typeof data === "string") {
    if (data.trim().startsWith("<")) return fallback;
    return data;
  }

  if (Array.isArray(data) && data.length > 0) {
    return typeof data[0] === "string" ? data[0] : JSON.stringify(data[0]);
  }

  if (data && typeof data === "object") {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail) && data.detail.length > 0) return String(data.detail[0]);
    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0)
      return String(data.non_field_errors[0]);

    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val) && val.length > 0) {
        return typeof val[0] === "string" ? `${val[0]}` : JSON.stringify(val[0]);
      } else if (typeof val === "string") {
        return val;
      }
    }
  }

  if (err.message && typeof err.message === "string") {
    return err.message;
  }

  return fallback;
}
