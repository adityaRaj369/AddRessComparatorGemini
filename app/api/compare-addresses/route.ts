import { NextRequest, NextResponse } from "next/server";
import { compareAddresses } from "@/lib/gemini";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Load the API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables");
}

// Define the schema for request validation
const addressComparisonSchema = z.object({
    address1: z.string().min(1, "Address 1 is required"),
    address2: z.string().min(1, "Address 2 is required"),
});
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedBody = addressComparisonSchema.parse(body);

        const { address1, address2 } = parsedBody;

        const result = await compareAddresses(address1, address2);
        if (!result || typeof result.match !== "boolean" || typeof result.confidence !== "number") {
            return NextResponse.json({ error: "Invalid response from Gemini API" }, { status: 500 });
        }
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in compare-addresses API:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
