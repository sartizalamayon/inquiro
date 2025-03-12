'use client'
import { ModeToggle } from "@/components/mood-toggle";
import { useSession, signIn, signOut } from "next-auth/react";


export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  return (
    <div className="text-4xl">
      Home
      <ModeToggle />



      <div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {session ? (
        <>
          <p>Signed in as {session?.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn("github")}>Sign in with GitHub</button>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
      )}
    </div>
      </div>
    </div>
  );
}
