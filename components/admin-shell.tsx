"use client";

import { House, Key, List, SidebarSimple } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { AdminSignOut } from "./admin-signout";

export function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className={`admin-page${collapsed ? " is-collapsed" : ""}`}>
      <aside className="admin-sidebar" aria-label="Điều hướng quản trị">
        <div className="admin-sidebar-head">
          <Link className="admin-profile" href="/" aria-label="Về trang chủ Nhà trọ Hồng Khang">
            <Image src="/images/logo-hong-khang.png" alt="" width={56} height={56} priority />
            <span><strong>Hồng Khang</strong><small>Quản trị viên</small></span>
          </Link>
          <button className="admin-sidebar-toggle" type="button" onClick={() => setCollapsed((value) => !value)} aria-expanded={!collapsed} aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"} title={collapsed ? "Mở rộng" : "Thu gọn"}>
            <SidebarSimple size={24} aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Các mục quản trị">
          <a href="#tong-quan" title="Tổng quan"><House size={22} aria-hidden="true" /><span>Tổng quan</span></a>
          <a href="#phong" title="Quản lý phòng"><List size={22} aria-hidden="true" /><span>Quản lý phòng</span></a>
          <a href="#doi-mat-khau" title="Đổi mật khẩu"><Key size={22} aria-hidden="true" /><span>Đổi mật khẩu</span></a>
        </nav>

        <div className="admin-sidebar-account">
          <p title={email}><span>Đang đăng nhập</span><strong>{email}</strong></p>
          <AdminSignOut />
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </main>
  );
}

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (password !== confirmation) {
      setIsError(true);
      setMessage("Mật khẩu nhập lại chưa khớp.");
      return;
    }

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage("Chưa thể đổi mật khẩu. Vui lòng thử lại.");
      return;
    }

    setPassword("");
    setConfirmation("");
    setMessage("Mật khẩu đã được cập nhật.");
  }

  return (
    <section className="admin-password" id="doi-mat-khau" aria-labelledby="password-title">
      <div>
        <h2 id="password-title">Đổi mật khẩu</h2>
        <p>Dùng ít nhất 8 ký tự và tránh dùng lại mật khẩu cũ.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Mật khẩu mới<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <label>Nhập lại mật khẩu<input type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label>
        {message && <p className={`form-message ${isError ? "form-error" : "form-success"}`} role={isError ? "alert" : "status"}>{message}</p>}
        <button className="admin-save" type="submit" disabled={loading}>{loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</button>
      </form>
    </section>
  );
}
