import { headers } from "next/headers";

export async function isAdminAuthorized() {
  const expected = process.env.ADMIN_DASHBOARD_TOKEN?.trim();
  if (!expected) return false;

  const hdrs = await headers();
  const provided = hdrs.get("x-admin-token")?.trim();
  if (!provided) return false;
  return provided === expected;
}

