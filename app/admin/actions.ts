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
  if (publicId) {
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
  const { error } = await supabase.from("room_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveRoomImage(formData: FormData) {
  const supabase = await requireAdmin();
  const roomTypeId = String(formData.get("room_type_id") ?? "");
  const imageId = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const { data: images, error: readError } = await supabase
    .from("room_images")
    .select("id, sort_order")
    .eq("room_type_id", roomTypeId)
    .order("sort_order")
    .order("created_at");
  if (readError) throw new Error(readError.message);

  const currentIndex = images.findIndex((image) => image.id === imageId);
  const targetIndex = currentIndex + direction;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= images.length) return;

  const reordered = [...images];
  [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
  const results = await Promise.all(reordered.map((image, index) =>
    supabase.from("room_images").update({ sort_order: index + 1 }).eq("id", image.id),
  ));
  const updateError = results.find((result) => result.error)?.error;
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
