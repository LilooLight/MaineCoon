import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tihiy-dom-2026";
const COOKIE_NAME = "cattery_admin";
// 7 days
const MAX_AGE = 60 * 60 * 24 * 7;

// Simple hash to avoid storing the raw password in the cookie.
// Not cryptographically strong — sufficient for a single-user admin gate.
function simpleHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return `h${h}`;
}

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json(
        { error: "Введите пароль" },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 401 }
      );
    }

    const token = simpleHash(`${ADMIN_PASSWORD}:${Date.now()}`);
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("POST /api/admin/auth error:", error);
    return NextResponse.json(
      { error: "Ошибка входа" },
      { status: 500 }
    );
  }
}

// GET /api/admin/auth — check current session
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
