"use client";

import "@coinbase/onchainkit/styles.css";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "ChainLedger",
      preference: "smartWalletOnly",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
          config={{
            appearance: {
              mode: "auto",
              theme: "default",
            },
          }}
        >
          {children}
          <Toaster
            richColors
            position="top-right"
          />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
