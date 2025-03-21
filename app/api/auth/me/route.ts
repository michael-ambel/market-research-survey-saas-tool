import { NextResponse } from "next/server";
import { verifyToken, getAuthCookie } from "../../../../utils/auth";

export async function GET(request: Request) {
  try {
    const token = getAuthCookie(request);

    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    const decoded = verifyToken(token);
    console.log(decoded);

    if (!decoded) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    return NextResponse.json(
      { isLoggedIn: true, user: decoded },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
