"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("[client_error]", { message: error.message, stack: error.stack, digest: error.digest });
  }, [error]);

  return (
    <main className="error-page">
      <section className="error-panel" aria-labelledby="error-title">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 8v5m0 3h.01M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
        </svg>
        <h1 id="error-title">Trang chưa thể tải</h1>
        <p>Đã có lỗi ngoài dự kiến. Bạn có thể thử tải lại hoặc quay về trang chủ.</p>
        {error.digest && <p className="error-code">Mã lỗi: {error.digest}</p>}
        <div className="error-actions">
          <button type="button" onClick={() => retry()}>Thử lại</button>
          <Link href="/">Về trang chủ</Link>
        </div>
      </section>
    </main>
  );
}
