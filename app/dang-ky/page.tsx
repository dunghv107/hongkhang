import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Đăng ký | Nhà trọ Hồng Khang",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  redirect("/dang-nhap");
}
