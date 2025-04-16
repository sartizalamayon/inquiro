'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"

export function AuthForm({
  isLogin,
  handleFunction,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  isLoading = false,
  error = "",
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // Do not use redirect here - let the page component handle it
  // This avoids React hooks rendering issues
  useEffect(() => {
    if (session) {
      toast.success("Already logged in");
      router.push("/dashboard");
    }
  }, [session, router]);
  
  // Define OAuth sign-in handlers
  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };
  
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md")}>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isLogin? 'Welcome Back' : 'Get Started'}</CardTitle>
          <CardDescription>
            {isLogin? 'Sign In':'Sign Up'} with Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="break-words">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleFunction}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGithubSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github mr-2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>                      
                  {isLogin ? "Login with Github" : "Sign up with Github"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2" width="24" height="24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {isLogin ? "Login with Google" : "Sign up with Google"}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                {!isLogin && (
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tell us who you are"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Think something complex"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"></path>
                      </svg>
                      {isLogin ? "Logging in..." : "Signing up..."}
                    </>
                  ) : (
                    isLogin ? "Login" : "Signup"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                {isLogin? "Don't have an account?" : "Already have an account?"}{" "}
                <Link href={isLogin? '/signup':'/signin'} className="underline underline-offset-4">
                  {isLogin? 'Sign up' : 'Sign in'}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}