// Providers
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsProvider } from "@/components/SubmissionsProvider";
// Styling
import "./globals.css";

export const metadata = {
  title: "GDG Club | Recruitment Portal",
  description: "Recruitment portal for GDG Club",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SubmissionsProvider>
            {children}
            <Toaster />
          </SubmissionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
