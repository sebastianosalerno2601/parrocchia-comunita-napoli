export function isVideoFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const isVideoMime = file.type.startsWith("video/");
  const isVideoExt = /\.(mp4|mov|webm|m4v|avi|mkv|mpeg|mpg|3gp)$/i.test(name);
  return isVideoMime || isVideoExt;
}

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  timestamp: string;
  folder: string;
  signature: string;
};

type UploadResult = { secure_url: string; public_id: string };

async function fetchCloudinarySignature(
  adminToken: string,
): Promise<CloudinarySignature> {
  const res = await fetch("/api/admin/cloudinary-signature", {
    method: "POST",
    headers: { "x-admin-token": adminToken.trim() },
    cache: "no-store",
  });
  const data = (await res.json()) as CloudinarySignature & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Firma Cloudinary fallita.");
  }
  if (
    !data.cloudName ||
    !data.apiKey ||
    !data.timestamp ||
    !data.folder ||
    !data.signature
  ) {
    throw new Error("Risposta firma Cloudinary incompleta.");
  }
  return data;
}

/**
 * Carica direttamente su Cloudinary dal browser (upload firmato).
 * Necessario per i video: il proxy serverless ha limite ~4.5 MB (413).
 */
export async function uploadFileDirectToCloudinary(
  file: File,
  adminToken: string,
): Promise<UploadResult> {
  const sig = await fetchCloudinarySignature(adminToken);
  const resourceType = isVideoFile(file) ? "video" : "image";

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/${resourceType}/upload`;
  const uploadRes = await fetch(url, { method: "POST", body: form });
  const data = (await uploadRes.json()) as UploadResult & {
    error?: { message?: string };
  };

  if (!uploadRes.ok) {
    throw new Error(data.error?.message ?? "Upload Cloudinary fallito.");
  }
  if (!data.secure_url || !data.public_id) {
    throw new Error("Risposta Cloudinary inattesa.");
  }

  return { secure_url: data.secure_url, public_id: data.public_id };
}
