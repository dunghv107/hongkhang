import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "../../components/auth-form";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = { title: "Đăng nhập | Nhà trọ Hồng Khang" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.app_metadata.role === "admin") redirect("/admin");

  return <AuthForm mode="login" />;
}
