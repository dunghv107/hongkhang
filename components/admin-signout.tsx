"use client";

import { SignOut } from "@phosphor-icons/react";
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

  return <button className="admin-signout" type="button" onClick={signOut} disabled={loading} title="Đăng xuất"><SignOut size={22} aria-hidden="true" /><span>{loading ? "Đang đăng xuất..." : "Đăng xuất"}</span></button>;
}
