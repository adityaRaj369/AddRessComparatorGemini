// import { NextRequest, NextResponse } from "next/server";
// import { compareAddresses } from "@/lib/gemini";
// import { z } from "zod";

// // Define the schema for request validation
// const addressComparisonSchema = z.object({
//   address1: z.string().min(1, "Address 1 is required"),
//   address2: z.string().min(1, "Address 2 is required"),
// });

// export async function POST(request: NextRequest) {
//   try {
//     // Parse the request body
//     const body = await request.json();
    
//     // Validate the request body
//     const result = addressComparisonSchema.safeParse(body);
    
//     if (!result.success) {
//       return NextResponse.json(
//         { error: "Invalid request", details: result.error.format() },
//         { status: 400 }
//       );
//     }
    
//     const { address1, address2 } = result.data;
    
//     // Check if Gemini API key is configured
//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json(
//         { error: "Gemini API key is not configured" },
//         { status: 500 }
//       );
//     }
    
//     // Compare the addresses
//     const comparisonResult = await compareAddresses(address1, address2);
    
//     // Return the comparison result
//     return NextResponse.json(comparisonResult);
//   } catch (error) {
//     console.error("Error in address comparison API:", error);
//     return NextResponse.json(
//       { error: "Failed to process address comparison" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { compareAddresses } from "@/lib/gemini";
import { z } from "zod";
export const dynamic = "force-dynamic";

// Define the API key directly
const GEMINI_API_KEY = "AIzaSyAls427HuGceEfCYKB0JcSKz_4Hwu2zbjY";

// Define the schema for request validation
const addressComparisonSchema = z.object({
  address1: z.string().min(1, "Address 1 is required"),
  address2: z.string().min(1, "Address 2 is required"),
});
export async function POST(request: Request) {
  try {
      const body = await request.json().catch(() => { throw new Error("Invalid JSON input"); });

      if (!body.address1 || !body.address2) {
          return new Response(JSON.stringify({ error: "Both addresses are required" }), { status: 400 });
      }

      const result = await compareAddresses(body.address1, body.address2);
      
      if (!result) {
          return new Response(JSON.stringify({ error: "Failed to compare addresses" }), { status: 500 });
      }

      return new Response(JSON.stringify({ result }), { status: 200 });

  } catch (error) {
      console.error("Error in compare-addresses API:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
