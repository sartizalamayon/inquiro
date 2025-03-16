"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          name, 
          password 
        }),
      });

      if (res.ok) {
        // Show success toast before redirecting
        toast.success("Account created successfully. Please sign in.");
        
        // Delay redirect slightly to ensure toast is visible
        setTimeout(() => {
          router.push("/signin");
        }, 300);
      } else {
        // Handle different error types
        try {
          const errorData = await res.json();
          if (res.status === 409) {
            setError("This email is already registered. Please sign in instead.");
          } else if (errorData.detail && errorData.detail.includes("validation error")) {
            // Format validation errors to be more user-friendly
            setError("Invalid data provided. Please check your information and try again.");
            console.error("Validation error:", errorData.detail);
          } else {
            setError(errorData.detail || "Failed to create account. Please try again.");
          }
        } catch (parseErr) {
          setError("Failed to create account. Please try again.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <AuthForm 
        isLogin={false}
        handleFunction={handleSignUp}
        email={email}
        setEmail={setEmail}
        name={name}
        setName={setName}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}