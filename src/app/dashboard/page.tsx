"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Protect this page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Welcome, {session.user?.name || session.user?.email}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You're signed in as {session.user?.email}
              </p>
            </div>
            
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Account Information</h3>
              <ul className="space-y-2">
                <li><strong>Email:</strong> {session.user?.email}</li>
                <li><strong>Name:</strong> {session.user?.name || "Not provided"}</li>
                <li><strong>User ID:</strong> {session.user?.id || "Not available"}</li>
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="mt-4"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}