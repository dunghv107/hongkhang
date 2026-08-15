import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSignOut } from "../../components/admin-signout";
import { createClient } from "../../lib/supabase/server";
import type { RoomType } from "../../lib/rooms";
import { deleteRoomImage, updateRoom, uploadRoomImages } from "./actions";

export const metadata: Metadata = { title: "Quản trị | Nhà trọ Hồng Khang", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap");
  if (user.app_metadata.role !== "admin") redirect("/");
  const { data, error } = await supabase.from("room_types").select("*, room_images(*)").order("sort_order").order("sort_order", { referencedTable: "room_images" });
  const rooms = (data ?? []) as RoomType[];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={68} height={68} priority />
          <span>Quản trị<br /><strong>Hồng Khang</strong></span>
        </Link>
        <AdminSignOut />
      </header>
      <section className="admin-content" aria-labelledby="admin-title">
        <p className="admin-user">Đang đăng nhập: {user.email}</p>
        <h1 id="admin-title">Khu vực quản trị</h1>
        <p>Chỉnh thông tin và thư viện ảnh hiển thị tại mục “Các loại phòng hiện có”.</p>
        {error ? <div className="admin-placeholder"><h2>Chưa có bảng dữ liệu phòng</h2><p>Chạy migration trong thư mục <code>supabase/migrations</code> trên Supabase rồi tải lại trang.</p></div> : <div className="admin-room-list">
          {rooms.map((room) => <article className="admin-room-card" key={room.id}>
            <form className="admin-room-form" action={updateRoom}>
              <input type="hidden" name="id" value={room.id} />
              <label>Tên loại phòng<input name="name" defaultValue={room.name} required /></label>
              <label>Giá mỗi tháng (VNĐ)<input name="price_vnd" type="number" min="0" step="50000" defaultValue={room.price_vnd ?? ""} /></label>
              <label>Tiện ích, phân cách bằng dấu phẩy<input name="amenities" defaultValue={room.amenities.join(", ")} /></label>
              <label className="admin-checkbox"><input name="published" type="checkbox" defaultChecked={room.published} /> Hiển thị trên website</label>
              <button className="admin-save" type="submit">Lưu thông tin</button>
            </form>
            <div className="admin-gallery">
              {room.room_images.map((image) => <div key={image.id} className="admin-image">
                <Image src={image.secure_url} alt={image.alt_text} fill sizes="160px" />
                <form action={deleteRoomImage}><input type="hidden" name="id" value={image.id} /><input type="hidden" name="public_id" value={image.public_id ?? ""} /><button type="submit">Xóa ảnh</button></form>
              </div>)}
            </div>
            <form className="admin-upload" action={uploadRoomImages}>
              <input type="hidden" name="room_type_id" value={room.id} />
              <label>Thêm ảnh<input name="images" type="file" accept="image/*" multiple required /></label>
              <button className="admin-save" type="submit">Tải ảnh lên</button>
            </form>
          </article>)}
        </div>}
      </section>
    </main>
  );
}
