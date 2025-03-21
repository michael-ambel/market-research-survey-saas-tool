import { NextResponse } from "next/server";
import connectDb from "../../../../utils/connectDb";
import User from "../../../../models/User";
import { comparePassword, generateToken } from "../../../../utils/auth";

export async function POST(request: Request) {
  try {
    await connectDb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = generateToken(user._id.toString());

    return NextResponse.json({ token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
