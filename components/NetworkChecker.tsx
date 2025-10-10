"use client";

import { JSX, useEffect, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function NetworkChecker(): JSX.Element | null {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    if (chain && chain.id !== base.id) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [chain]);

  if (!showAlert) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      className="mb-6"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wrong Network</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Please switch to Base network to use ChainLedger.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => switchChain({ chainId: base.id })}
          className="ml-4"
        >
          Switch to Base
        </Button>
      </AlertDescription>
    </Alert>
  );
}
