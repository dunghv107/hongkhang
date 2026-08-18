import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "hk_recovery_session";
const SUCCESS_MESSAGE = "Nếu email tồn tại, đường dẫn khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.";
const RATE_LIMIT_MESSAGE = "Bạn đã yêu cầu quá 3 lần trong 10 phút. Vui lòng thử lại sau.";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function respond(message: string, status: number, sessionId: string, setCookie: boolean) {
  const response = NextResponse.json({ message }, { status });
  if (setCookie) {
    response.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const sessionId = sessionCookie ?? randomUUID();
  const setCookie = !sessionCookie;

  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return respond("Yêu cầu không hợp lệ.", 403, sessionId, setCookie);
  }

  if (Number(request.headers.get("content-length") ?? 0) > 4096) {
    return respond("Yêu cầu không hợp lệ.", 413, sessionId, setCookie);
  }

  let email: string;
  try {
    const body = await request.json() as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return respond("Yêu cầu không hợp lệ.", 400, sessionId, setCookie);
  }

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return respond("Email không hợp lệ.", 400, sessionId, setCookie);
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data: allowed, error: rateLimitError } = await admin.rpc("claim_password_recovery_attempt", {
    p_email_hash: hash(email),
    p_session_hash: hash(sessionId),
  });

  if (rateLimitError) {
    console.error("[auth/recover] rate limit failed", { code: rateLimitError.code });
    return respond("Chưa thể gửi email khôi phục. Vui lòng thử lại sau.", 503, sessionId, setCookie);
  }

  if (!allowed) return respond(RATE_LIMIT_MESSAGE, 429, sessionId, setCookie);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.nextUrl.origin}/dat-lai-mat-khau`,
  });

  if (error) {
    console.error("[auth/recover] email delivery failed", { code: error.code });
    return respond("Chưa thể gửi email khôi phục. Vui lòng thử lại sau.", 503, sessionId, setCookie);
  }

  return respond(SUCCESS_MESSAGE, 200, sessionId, setCookie);
}
