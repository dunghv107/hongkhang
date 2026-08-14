"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/dang-nhap");
    router.refresh();
  }

  return <button className="admin-signout" type="button" onClick={signOut} disabled={loading}>{loading ? "Đang đăng xuất..." : "Đăng xuất"}</button>;
}
