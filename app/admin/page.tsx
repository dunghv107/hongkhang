import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSignOut } from "../../components/admin-signout";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = { title: "Quản trị | Nhà trọ Hồng Khang", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap");
  if (user.app_metadata.role !== "admin") redirect("/");

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
        <p>Nền tảng đăng nhập quản trị đã sẵn sàng. Các chức năng quản lý phòng sẽ được bổ sung khi có yêu cầu thực tế.</p>
        <div className="admin-placeholder">
          <h2>Chưa có chức năng quản lý</h2>
          <p>Giai đoạn này chỉ xác nhận tài khoản admin và bảo vệ trang quản trị.</p>
        </div>
      </section>
    </main>
  );
}
