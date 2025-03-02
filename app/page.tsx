"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ComparisonResult {
  match: boolean;
  confidence: number;
  explanation: string;
}

export default function Home() {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!address1 || !address2) {
      setError("Both addresses are required");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/compare-addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address1, address2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compare addresses");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Address Comparison</CardTitle>
          <CardDescription>
            Compare two addresses to determine if they refer to the same location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address 1
              </Label>
              <Input
                id="address1"
                placeholder="Enter first address"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            
            <div className="flex justify-center">
              <div className="bg-muted rounded-full p-2">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address2" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Address 2
              </Label>
              <Input
                id="address2"
                placeholder="Enter second address"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCompare} 
            className="w-full" 
            disabled={loading || !address1 || !address2}
          >
            {loading ? "Comparing..." : "Compare Addresses"}
          </Button>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          {result && (
            <div className="mt-6 space-y-4">
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Result</h3>
                  <div className="flex items-center gap-2">
                    {result.match ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {result.match ? "Match" : "No Match"}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        result.match ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="text-muted-foreground">{result.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center">
          Powered by Google Gemini AI
        </CardFooter>
      </Card>
    </div>
  );
}