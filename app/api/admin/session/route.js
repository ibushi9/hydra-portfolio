import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminSession";

export async function GET(request) {
  return NextResponse.json({ authenticated: isAuthenticated(request) });
}
