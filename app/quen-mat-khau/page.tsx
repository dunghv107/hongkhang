import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Nhà trọ Hồng Khang",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
