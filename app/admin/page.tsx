import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSignOut } from "../../components/admin-signout";
import { AdminImageGallery } from "../../components/admin-image-gallery";
import { ConfirmDeleteRoomButton } from "../../components/confirm-delete-room-button";
import { createClient } from "../../lib/supabase/server";
import type { RoomType } from "../../lib/rooms";
import { createRoom, deleteRoom, updateRoom } from "./actions";

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
      <aside className="admin-sidebar" aria-label="Điều hướng quản trị">
        <Link className="brand admin-brand" href="/admin">
          <Image className="brand-logo" src="/images/logo-hong-khang.png" alt="" width={68} height={68} priority />
          <span>Quản trị<br /><strong>Hồng Khang</strong></span>
        </Link>
        <nav className="admin-nav">
          <p>Chức năng quản lý</p>
          <a className="is-active" href="#quan-ly-phong">Quản lý phòng</a>
          <div className="admin-subnav" aria-label="Danh sách loại phòng">
            {rooms.map((room) => <a href={`#phong-${room.id}`} key={room.id}>{room.name}</a>)}
          </div>
          <Link className="admin-view-site" href="/" target="_blank">Xem website</Link>
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-user">{user.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <section className="admin-content" aria-labelledby="admin-title">
        <div id="quan-ly-phong" className="admin-intro">
          <h1 id="admin-title">Quản lý phòng và hình ảnh</h1>
          <p>Cập nhật thông tin, tải ảnh và sắp xếp thứ tự hiển thị trên website.</p>
          <details className="admin-create-room">
            <summary>Thêm loại phòng mới</summary>
            <form action={createRoom}>
              <label>Tên loại phòng<input name="name" maxLength={80} placeholder="Ví dụ: Phòng có gác" required /></label>
              <button className="admin-save" type="submit">Tạo loại phòng</button>
            </form>
          </details>
        </div>
        {error ? <div className="admin-placeholder"><h2>Chưa có bảng dữ liệu phòng</h2><p>Chạy migration trong thư mục <code>supabase/migrations</code> trên Supabase rồi tải lại trang.</p></div> : <div className="admin-room-list">
          {rooms.map((room) => <article className="admin-room-card" id={`phong-${room.id}`} key={room.id}>
            <header className="admin-room-heading">
              <div><h2>{room.name}</h2><p>{room.room_images.length} hình ảnh</p></div>
              <div className="admin-room-heading-actions">
                <span>{room.published ? "Đang hiển thị" : "Đang ẩn"}</span>
                <form action={deleteRoom}>
                  <input type="hidden" name="id" value={room.id} />
                  <ConfirmDeleteRoomButton roomName={room.name} />
                </form>
              </div>
            </header>
            <form className="admin-room-form" action={updateRoom}>
              <input type="hidden" name="id" value={room.id} />
              <label>Tên loại phòng<input name="name" defaultValue={room.name} required /></label>
              <label>Giá mỗi tháng (VNĐ)<input name="price_vnd" type="number" min="0" step="50000" defaultValue={room.price_vnd ?? ""} /></label>
              <label>Tiện ích, phân cách bằng dấu phẩy<input name="amenities" defaultValue={room.amenities.join(", ")} /></label>
              <label className="admin-checkbox"><input name="published" type="checkbox" defaultChecked={room.published} /> Hiển thị trên website</label>
              <button className="admin-save" type="submit">Lưu thông tin</button>
            </form>
            <section className="admin-gallery-section" aria-labelledby={`gallery-${room.id}`}>
              <div className="admin-gallery-heading">
                <div><h3 id={`gallery-${room.id}`}>Thư viện ảnh</h3><p>Ảnh đầu tiên được dùng làm ảnh đại diện.</p></div>
              </div>
              <AdminImageGallery
                key={room.room_images.map((image) => image.id).join("|")}
                roomId={room.id}
                roomName={room.name}
                initialImages={room.room_images.filter((image): image is typeof image & { id: string } => Boolean(image.id))}
              />
            </section>
          </article>)}
        </div>}
      </section>
    </main>
  );
}
