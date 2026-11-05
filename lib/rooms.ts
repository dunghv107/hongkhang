export type RoomImage = { id?: string; secure_url: string; public_id?: string | null; alt_text: string; sort_order: number };
export type RoomType = { id: string; name: string; price_vnd: number | null; amenities: string[]; sort_order: number; published: boolean; room_images: RoomImage[] };

export const fallbackRooms: RoomType[] = [
  { id: "1", name: "Loại 1", price_vnd: 3500000, amenities: ["Tủ lạnh", "Máy lạnh", "Phòng tắm riêng"], sort_order: 1, published: true, room_images: [
    { secure_url: "/images/room-1-door.png", alt_text: "Cửa gỗ phòng 103 trên tường gạch, bên cạnh tượng gỗ chim công", sort_order: 1 },
    { secure_url: "/images/room-1-bed.png", alt_text: "Toàn cảnh phòng Loại 1 với giường đôi, máy lạnh, bàn ghế và sàn giả gỗ", sort_order: 2 },
    { secure_url: "/images/room-1-window.jpg", alt_text: "Góc phòng Loại 1 có cửa sổ tròn, bộ bàn ghế và tủ quần áo gỗ", sort_order: 3 },
    { secure_url: "/images/room-1-sink.jpg", alt_text: "Khu bếp phòng Loại 1 có bồn rửa, kệ chén và tủ gỗ", sort_order: 4 },
  ] },
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
