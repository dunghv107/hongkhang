export type RoomImage = { id?: string; secure_url: string; public_id?: string | null; alt_text: string; sort_order: number };
export type RoomType = { id: string; name: string; price_vnd: number | null; amenities: string[]; sort_order: number; published: boolean; room_images: RoomImage[] };

export const fallbackRooms: RoomType[] = [
  { id: "1", name: "Loại 1", price_vnd: 3500000, amenities: ["Máy lạnh", "Bồn rửa", "Nhà vệ sinh trong phòng"], sort_order: 1, published: true, room_images: [
    { secure_url: "/images/room-1-door.png", alt_text: "Cửa gỗ phòng 103 trên tường gạch, bên cạnh tượng gỗ chim công", sort_order: 1 },
    { secure_url: "/images/room-1-bed.png", alt_text: "Toàn cảnh phòng Loại 1 với giường đôi, máy lạnh, bàn ghế và sàn giả gỗ", sort_order: 2 },
    { secure_url: "/images/room-1-window.jpg", alt_text: "Góc phòng Loại 1 có cửa sổ tròn, bộ bàn ghế và tủ quần áo gỗ", sort_order: 3 },
    { secure_url: "/images/room-1-sink.jpg", alt_text: "Khu bếp phòng Loại 1 có bồn rửa, kệ chén và tủ gỗ", sort_order: 4 },
  ] },
  { id: "2", name: "Loại 2", price_vnd: 2500000, amenities: ["Máy lạnh", "Bồn rửa", "Nhà vệ sinh trong phòng"], sort_order: 2, published: true, room_images: [
    { secure_url: "/images/room-2-truoc-cua.jpg", alt_text: "Mặt tiền Nhà trọ Hồng Khang với bảng tên, cổng sắt và cây xanh trước cửa", sort_order: 1 },
    { secure_url: "/images/room-2-tong-quan.jpg", alt_text: "Toàn cảnh phòng Loại 2 lát gạch xám, có máy lạnh và cửa sổ gỗ", sort_order: 2 },
    { secure_url: "/images/room-2-anh-chung.jpg", alt_text: "Phòng Loại 2 nhìn ra cửa kính ban công, rèm xám và kệ gỗ nhỏ", sort_order: 3 },
    { secure_url: "/images/room-2-ngay-cua.jpg", alt_text: "Nhìn vào phòng Loại 2 từ cửa kính ra vào", sort_order: 4 },
    { secure_url: "/images/room-2-can-bep.jpg", alt_text: "Khu bếp phòng Loại 2 có bồn rửa, tủ gỗ và lối vào nhà vệ sinh", sort_order: 5 },
    { secure_url: "/images/room-2-nha-ve-sinh.jpg", alt_text: "Nhà vệ sinh phòng Loại 2 có bồn cầu, lavabo và gương", sort_order: 6 },
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
