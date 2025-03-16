"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Skip rendering anything until component is mounted on client
  // This prevents hydration mismatch errors
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Force the children to be client-side only
  return (
    <NextThemesProvider {...props}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </NextThemesProvider>
  );
}