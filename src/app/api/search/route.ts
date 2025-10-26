import { NextRequest, NextResponse } from "next/server";
import { SearchRequestSchema } from "@/lib/utils/validation";
import { searchPhones } from "@/lib/data/search";
import { rankPhones } from "@/lib/data/ranking";

/**
 * Direct search API endpoint (optional, for programmatic access)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = SearchRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: validation.error.errors },
        { status: 400 }
      );
    }

    const params = validation.data;

    // Search for phones
    let results = searchPhones(params);

    // Rank results
    results = rankPhones(results, {
      budget: params.budget,
    });

    return NextResponse.json({
      phones: results,
      count: results.length,
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}


