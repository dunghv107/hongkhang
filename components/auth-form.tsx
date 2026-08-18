"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

type Mode = "login" | "forgot" | "reset";

const content = {
  login: { title: "Đăng nhập", description: "Đăng nhập để tiếp tục với Nhà trọ Hồng Khang.", button: "Đăng nhập" },
  forgot: { title: "Quên mật khẩu", description: "Nhập email, chúng tôi sẽ gửi đường dẫn đặt lại mật khẩu.", button: "Gửi email khôi phục" },
  reset: { title: "Đặt mật khẩu mới", description: "Chọn mật khẩu mới có ít nhất 8 ký tự.", button: "Cập nhật mật khẩu" },
} satisfies Record<Mode, { title: string; description: string; button: string }>;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [supabase] = useState(createClient);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const needsEmail = mode !== "reset";
  const needsPassword = mode === "login" || mode === "reset";
  const needsConfirmation = mode === "reset";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (needsConfirmation && password !== confirmPassword) {
      setIsError(true);
      setMessage("Hai mật khẩu chưa trùng nhau.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user.app_metadata.role !== "admin") {
          await supabase.auth.signOut();
          setIsError(true);
          setMessage("Tài khoản này không có quyền quản trị.");
          return;
        }
        router.push("/admin");
        router.refresh();
        return;
      }

      if (mode === "forgot") {
        const response = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result = await response.json() as { message?: string };
        if (!response.ok) throw new Error(result.message ?? "Chưa thể gửi email khôi phục.");
        setMessage(result.message ?? "Nếu email tồn tại, đường dẫn khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.");
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        await supabase.auth.signOut();
        router.replace("/dang-nhap");
        return;
      }
    } catch (error) {
      setIsError(true);
      setMessage(
        mode === "login"
          ? "Email hoặc mật khẩu không đúng."
          : mode === "reset"
              ? "Liên kết khôi phục không hợp lệ hoặc đã hết hạn."
              : error instanceof Error ? error.message : "Chưa thể gửi email khôi phục. Vui lòng đợi một lúc rồi thử lại.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Nhà trọ Hồng Khang">
        <Image src="/images/san-chung-hong-khang.jpg" alt="Sân chung tại Nhà trọ Hồng Khang" fill priority sizes="(max-width: 840px) 100vw, 48vw" />
        <div className="auth-visual-overlay" />
        <div className="auth-brand-block">
          <Image src="/images/logo-hong-khang.png" alt="Logo Nhà trọ Hồng Khang" width={112} height={112} />
          <p>75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long</p>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-card">
          <Link className="back-link" href="/">Về trang chủ</Link>
          <h1 id="auth-title">{content[mode].title}</h1>
          <p className="auth-description">{content[mode].description}</p>

          <form onSubmit={handleSubmit}>
            {needsEmail && (
              <label>
                Email
                <input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
            )}

            {needsPassword && (
              <label>
                Mật khẩu
                <span className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </span>
              </label>
            )}

            {needsConfirmation && (
              <label>
                Nhập lại mật khẩu
                <input type={showPassword ? "text" : "password"} name="confirmPassword" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </label>
            )}

            {message && <p className={`form-message ${isError ? "form-error" : "form-success"}`} role={isError ? "alert" : "status"}>{message}</p>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Đang xử lý..." : content[mode].button}</button>
          </form>

          <div className="auth-links">
            {mode === "login" && <Link href="/quen-mat-khau">Quên mật khẩu?</Link>}
            {(mode === "forgot" || mode === "reset") && <Link href="/dang-nhap">Quay lại đăng nhập</Link>}
          </div>
        </div>
      </section>
    </main>
  );
}
