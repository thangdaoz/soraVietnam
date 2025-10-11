import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/credit-packages
 * 
 * Fetches all active credit packages from the database
 * Returns packages sorted by display_order
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch active credit packages from database
    const { data: packages, error } = await supabase
      .from("credit_packages")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching credit packages:", error);
      return NextResponse.json(
        { error: "Failed to fetch credit packages" },
        { status: 500 }
      );
    }

    // Transform database format to match frontend interface
    const transformedPackages = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      nameEn: pkg.name_en,
      description: pkg.description || "",
      credits: pkg.credits,
      priceVnd: Number(pkg.price_vnd),
      discountPercentage: pkg.discount_percentage || 0,
      isPopular: pkg.is_popular || false,
      displayOrder: pkg.display_order || 0,
      features: [
        `${pkg.credits.toLocaleString("vi-VN")} credits`,
        `Tạo ~${Math.floor(pkg.credits / 100)} video`,
        ...(pkg.discount_percentage && pkg.discount_percentage > 0
          ? [`Tiết kiệm ${pkg.discount_percentage}%`]
          : []),
        "Chất lượng cao",
        "Hỗ trợ 24/7",
      ],
    }));

    return NextResponse.json({
      success: true,
      packages: transformedPackages,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
