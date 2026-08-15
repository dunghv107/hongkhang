export type RoomImage = { id?: string; secure_url: string; public_id?: string | null; alt_text: string; sort_order: number };
export type RoomType = { id: string; name: string; price_vnd: number | null; amenities: string[]; sort_order: number; published: boolean; room_images: RoomImage[] };

export const fallbackRooms: RoomType[] = [
  { id: "1", name: "Loại 1", price_vnd: 3500000, amenities: ["Tủ lạnh", "Máy lạnh", "Phòng tắm riêng"], sort_order: 1, published: true, room_images: [
    { secure_url: "/images/phong-ngu-hong-khang.jpg", alt_text: "Không gian phòng Loại 1", sort_order: 1 },
    { secure_url: "/images/loi-di-hong-khang.jpg", alt_text: "Lối đi khu phòng Loại 1", sort_order: 2 },
    { secure_url: "/images/phong-tam-hong-khang.jpg", alt_text: "Phòng tắm Loại 1", sort_order: 3 },
  ] },
  { id: "2", name: "Loại 2", price_vnd: 3500000, amenities: ["Tủ lạnh", "Máy lạnh", "Phòng tắm riêng"], sort_order: 2, published: true, room_images: [{ secure_url: "/images/loi-di-hong-khang.jpg", alt_text: "Hình ảnh phòng Loại 2", sort_order: 1 }] },
  { id: "3", name: "Loại 3", price_vnd: 3500000, amenities: ["Tủ lạnh", "Máy lạnh", "Phòng tắm riêng"], sort_order: 3, published: true, room_images: [{ secure_url: "/images/phong-tam-hong-khang.jpg", alt_text: "Hình ảnh phòng Loại 3", sort_order: 1 }] },
];

export async function getPublicRooms() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/room_types?select=*,room_images(*)&published=eq.true&order=sort_order.asc&room_images.order=sort_order.asc`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallbackRooms;
    const rooms = await response.json() as RoomType[];
    return rooms.length ? rooms : fallbackRooms;
  } catch {
    return fallbackRooms;
  }
}
