import { NextResponse } from "next/server";
import connectDb from "../../../../utils/connectDb";
import User from "../../../../models/User";
import { hashPassword, generateToken } from "../../../../utils/auth";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();

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
