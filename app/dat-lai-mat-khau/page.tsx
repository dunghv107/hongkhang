import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Nhà trọ Hồng Khang",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <AuthForm mode="reset" />;
}
