import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type LogoutOptions = {
  redirectTo?: string;
  showToast?: boolean;
  toastMessage?: string;
};

export function useLogout() {
  const router = useRouter();

  const logout = async ({
    redirectTo = "/",
    showToast = true,
    toastMessage = "Successfully logged out"
  }: LogoutOptions = {}) => {
    try {
      // Call NextAuth signOut function
      await signOut({ 
        redirect: false, // We'll handle redirect manually
      });
      
      // Show toast notification if enabled
      if (showToast) {
        toast.success(toastMessage);
      }
      
      // Redirect user
      router.push(redirectTo);
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out");
    }
  };

  return { logout };
}