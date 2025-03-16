"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for success message on component mount
  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      toast.success(success);
      
      // Clean up the URL without the success parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different error types
        if (result.error.includes("not found")) {
          setError("Account not found. Please check your email or sign up.");
        } else if (result.error.includes("Invalid credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(result.error);
        }
        setIsLoading(false);
      } else {
        // Successful login - redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <AuthForm
        isLogin={true}
        handleFunction={handleSignIn}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}