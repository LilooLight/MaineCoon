import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/producers — all breeding cats with open genetic tests
export async function GET() {
  try {
    const producers = await db.producer.findMany({
      orderBy: [{ role: "asc" }, { birthDate: "asc" }],
    });

    return NextResponse.json({ producers });
  } catch (error) {
    console.error("GET /api/producers error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить производителей" },
      { status: 500 }
    );
  }
}
