import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
// Update the import path if Providers is located elsewhere, for example:
import { Providers } from "@/providers";
// Or, if Providers is in the same directory:
// import { Providers } from "./providers";
// import { FarcasterWrapper } from "@/components/FarcasterWrapper";
import { ResponseLogger } from "@/components/response-logger";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <Providers>
          {/* <FarcasterWrapper> */}
          <Navigation />
          <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-green-950/20">
            {children}
          </main>
          {/* </FarcasterWrapper> */}
        </Providers>
        <ResponseLogger />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "ChainLedger: Donation Tracker",
  description:
    "Enhance donation transparency with ChainLedger's frontend app. Explore public campaigns, manage private initiatives, track on-chain transactions, and verify NGO credentials seamlessly.",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl:
        "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_5ea557a1-81af-46af-b27a-b095baef43fa-d1jFzH7zBWiIAMX6UHra6PORvCRm4k",
      button: {
        title: "Open with Ohara",
        action: {
          type: "launch_frame",
          name: "ChainLedger: Donation Tracker",
          url: "https://melted-kitchen-467.app.ohara.ai",
          splashImageUrl:
            "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          splashBackgroundColor: "#ffffff",
        },
      },
    }),
  },
};
