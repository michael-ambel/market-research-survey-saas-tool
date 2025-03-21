import { setCookie, getCookie, deleteCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "survay@secret";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};

export const setAuthCookie = (token: string) => {
  setCookie("authToken", token, {
    maxAge: 60 * 60, // 1 hour
    path: "/",
    secure: process.env.NODE_ENV === "production", // HTTPS in production
    sameSite: "strict",
  });
};

export const getAuthCookie = (): string | null => {
  return getCookie("authToken") as string | null;
};

export const removeAuthCookie = () => {
  deleteCookie("authToken");
};
