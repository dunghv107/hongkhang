"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("[global_client_error]", { message: error.message, stack: error.stack, digest: error.digest });
  }, [error]);

  return (
    <html lang="vi">
      <body style={{ margin: 0, background: "#f2f2f2", color: "#000000", fontFamily: "Arial, sans-serif" }}>
        <main style={{ display: "grid", minHeight: "100dvh", padding: "24px", placeItems: "center" }}>
          <section style={{ maxWidth: "560px" }} aria-labelledby="global-error-title">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#5d5248" strokeWidth="1.7">
              <path d="M12 8v5m0 3h.01M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
            </svg>
            <h1 id="global-error-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", letterSpacing: "-.04em", lineHeight: 1, margin: "24px 0 16px" }}>Trang chưa thể tải</h1>
            <p style={{ color: "#5d5248", fontSize: "17px", lineHeight: 1.6, margin: 0 }}>Đã có lỗi ngoài dự kiến. Hãy thử tải lại hoặc quay về trang chủ.</p>
            {error.digest && <p style={{ color: "#5d5248", fontSize: "14px" }}>Mã lỗi: {error.digest}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "28px" }}>
              <button type="button" onClick={() => retry()} style={{ background: "#5d5248", border: 0, borderRadius: "999px", color: "#ffffff", cursor: "pointer", font: "inherit", fontWeight: 700, minHeight: "48px", padding: "12px 22px" }}>Thử lại</button>
              <Link href="/" style={{ alignItems: "center", border: "1px solid #5d5248", borderRadius: "999px", color: "#5d5248", display: "inline-flex", fontWeight: 700, minHeight: "48px", padding: "0 22px", textDecoration: "none" }}>Về trang chủ</Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
