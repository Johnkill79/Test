import { NextResponse } from "next/server";
import { getCars } from "@/lib/carsStore";

export async function GET() {
  const cars = await getCars();
  return NextResponse.json({ cars });
}

