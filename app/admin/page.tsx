import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSignOut } from "../../components/admin-signout";
import { ConfirmDeleteButton } from "../../components/confirm-delete-button";
import { createClient } from "../../lib/supabase/server";
import type { RoomType } from "../../lib/rooms";
import { deleteRoomImage, moveRoomImage, updateRoom, updateRoomImageAlt, uploadRoomImages } from "./actions";

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
          <a href="#tong-quan">Tổng quan</a>
          {rooms.map((room) => <a href={`#phong-${room.id}`} key={room.id}>{room.name}</a>)}
          <Link href="/" target="_blank">Xem website</Link>
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-user">{user.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <section className="admin-content" aria-labelledby="admin-title">
        <div id="tong-quan" className="admin-intro">
          <h1 id="admin-title">Quản lý phòng và hình ảnh</h1>
          <p>Cập nhật thông tin, tải ảnh và sắp xếp thứ tự hiển thị trên website.</p>
        </div>
        {error ? <div className="admin-placeholder"><h2>Chưa có bảng dữ liệu phòng</h2><p>Chạy migration trong thư mục <code>supabase/migrations</code> trên Supabase rồi tải lại trang.</p></div> : <div className="admin-room-list">
          {rooms.map((room) => <article className="admin-room-card" id={`phong-${room.id}`} key={room.id}>
            <header className="admin-room-heading">
              <div><h2>{room.name}</h2><p>{room.room_images.length} hình ảnh</p></div>
              <span>{room.published ? "Đang hiển thị" : "Đang ẩn"}</span>
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
              {room.room_images.length ? <div className="admin-gallery">
                {room.room_images.map((image, index) => <article key={image.id} className="admin-image">
                  <div className="admin-image-preview">
                    <Image src={image.secure_url} alt={image.alt_text} fill sizes="(max-width: 640px) 45vw, 220px" />
                    <span className="admin-image-order">{index === 0 ? "Ảnh đại diện" : `Ảnh ${index + 1}`}</span>
                  </div>
                  <form className="admin-image-alt" action={updateRoomImageAlt}>
                    <input type="hidden" name="id" value={image.id} />
                    <label>
                      Mô tả ảnh
                      <input name="alt_text" defaultValue={image.alt_text} placeholder={`Ví dụ: Không gian ${room.name}`} required />
                    </label>
                    <button type="submit">Lưu</button>
                  </form>
                  <div className="admin-image-actions">
                    <form action={moveRoomImage}>
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="room_type_id" value={room.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={index === 0} aria-label={`Đưa ảnh ${index + 1} lên trước`}>Lên</button>
                    </form>
                    <form action={moveRoomImage}>
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="room_type_id" value={room.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" disabled={index === room.room_images.length - 1} aria-label={`Đưa ảnh ${index + 1} xuống sau`}>Xuống</button>
                    </form>
                    <form action={deleteRoomImage}>
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="public_id" value={image.public_id ?? ""} />
                      <ConfirmDeleteButton />
                    </form>
                  </div>
                </article>)}
              </div> : <p className="admin-gallery-empty">Chưa có ảnh cho loại phòng này.</p>}
            </section>
            <form className="admin-upload" action={uploadRoomImages}>
              <input type="hidden" name="room_type_id" value={room.id} />
              <label>Thêm ảnh<input name="images" type="file" accept="image/*" multiple required /></label>
              <label>Mô tả ảnh mới<input name="alt_text" placeholder={`Ví dụ: Không gian ${room.name}`} required /></label>
              <button className="admin-save" type="submit">Tải ảnh lên</button>
            </form>
          </article>)}
        </div>}
      </section>
    </main>
  );
}
