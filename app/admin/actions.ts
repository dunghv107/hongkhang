"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata.role !== "admin") throw new Error("Không có quyền quản trị.");
  return supabase;
}

async function destroyCloudinaryImage(publicId: string) {
  if (!publicId) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex");
  const body = new FormData();
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("api_key", process.env.CLOUDINARY_API_KEY!);
  body.append("signature", signature);
  body.append("invalidate", "true");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, { method: "POST", body });
  if (!response.ok) throw new Error("Không thể xóa ảnh trên Cloudinary.");
}

export async function createRoom(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 80) throw new Error("Tên loại phòng không hợp lệ.");
  const { data: lastRoom, error: readError } = await supabase
    .from("room_types")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (readError) throw new Error(readError.message);
  const { error } = await supabase.from("room_types").insert({
    name,
    price_vnd: null,
    amenities: [],
    published: false,
    sort_order: (lastRoom?.sort_order ?? 0) + 1,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function updateRoom(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const price = Number(formData.get("price_vnd"));
  const amenities = String(formData.get("amenities") ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const { error } = await supabase.from("room_types").update({
    name: String(formData.get("name") ?? "").trim(),
    price_vnd: Number.isFinite(price) ? price : null,
    amenities,
    published: formData.get("published") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadRoomImages(formData: FormData) {
  const supabase = await requireAdmin();
  const roomTypeId = String(formData.get("room_type_id"));
  const altText = String(formData.get("alt_text") ?? "").trim();
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length) return;

  for (const file of files) {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) throw new Error("Chỉ nhận ảnh tối đa 10 MB.");
    const body = new FormData();
    body.append("file", file);
    body.append("asset_folder", `hong-khang/rooms/${roomTypeId}`);
    const authorization = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      headers: { Authorization: `Basic ${authorization}` },
      body,
    });
    if (!response.ok) throw new Error("Không thể tải ảnh lên Cloudinary.");
    const uploaded = await response.json() as { secure_url: string; public_id: string };
    const { error } = await supabase.from("room_images").insert({ room_type_id: roomTypeId, secure_url: uploaded.secure_url, public_id: uploaded.public_id, alt_text: altText, sort_order: Math.floor(Date.now() / 1000) });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateRoomImageAlt(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const altText = String(formData.get("alt_text") ?? "").trim();
  const { error } = await supabase.from("room_images").update({ alt_text: altText }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteRoomImage(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id"));
  const publicId = String(formData.get("public_id") ?? "");
  await destroyCloudinaryImage(publicId);
  const { error } = await supabase.from("room_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteRoom(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { data: images, error: readError } = await supabase
    .from("room_images")
    .select("public_id")
    .eq("room_type_id", id);
  if (readError) throw new Error(readError.message);
  for (const image of images) await destroyCloudinaryImage(image.public_id ?? "");
  const { error } = await supabase.from("room_types").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveRoomImageOrder(formData: FormData) {
  const supabase = await requireAdmin();
  const roomTypeId = String(formData.get("room_type_id") ?? "");
  let imageIds: string[];
  try {
    const parsed = JSON.parse(String(formData.get("image_ids") ?? "[]"));
    imageIds = Array.isArray(parsed) && parsed.every((id) => typeof id === "string") ? parsed : [];
  } catch {
    throw new Error("Thứ tự ảnh không hợp lệ.");
  }
  if (!imageIds.length || new Set(imageIds).size !== imageIds.length) throw new Error("Thứ tự ảnh không hợp lệ.");

  const { error } = await supabase.rpc("save_room_image_order", {
    p_room_type_id: roomTypeId,
    p_image_ids: imageIds,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
