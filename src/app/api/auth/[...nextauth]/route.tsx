import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      // Redirect to dashboard after successful login
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      // Ensure we get an email
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
    
        try {
          // Use the validate endpoint to check credentials
          const response = await fetch(`http://localhost:8000/users/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Invalid credentials");
          }
      
          const user = await response.json();
          return user;
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error instanceof Error ? error.message : "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Customize the redirect URL after sign in
    async redirect({ url, baseUrl }) {
      // If it's a sign-in, redirect to dashboard
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      // If it's a relative path, prepend the baseUrl
      else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Otherwise, return the original url
      return url;
    },
    // Add a signIn callback to create user in database for OAuth providers
    async signIn({ user, account, profile }) {
      // Only create users for OAuth providers
      if (account && (account.provider === "google" || account.provider === "github")) {
        try {
          // First check if user already exists
          const checkResponse = await fetch(`http://localhost:8000/users/${user.email}`);
          
          // If not found (404), create the user
          if (checkResponse.status === 404) {
            const createResponse = await fetch("http://localhost:8000/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name || user.email?.split('@')[0] || "User",
                email: user.email,
              }),
            });
            
            if (!createResponse.ok) {
              console.error("Failed to create user from OAuth provider:", await createResponse.text());
              // Still allow sign-in even if user creation fails
            }
          }
        } catch (error) {
          console.error("Error in OAuth sign-in flow:", error);
          // Allow sign-in to continue even if there was an error
        }
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };