import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";

export const metadata: Metadata = { title: "Đăng ký | Nhà trọ Hồng Khang" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
