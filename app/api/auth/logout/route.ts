import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    response.headers.append(
      "Set-Cookie",
      serialize("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      })
    );

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
