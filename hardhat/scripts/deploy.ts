import hre from "hardhat";
import { ethers as ethersLib } from "ethers";

// The hardhat-ethers plugin may attach ethers either on `hre.ethers` or on `hre.network.ethers`.
// Try both places to be robust across plugin versions and configurations.
const ethers = ((hre as any).ethers ?? (hre as any).network?.ethers) as any;

async function main() {
  // Debug: print available properties on the Hardhat runtime and network to see where ethers may be attached.
  try {
    console.log("hre keys:", Object.keys(hre));
    console.log("hre.network keys:", hre.network ? Object.keys(hre.network) : "<no network>");
    console.log("hre.ethers present:", !!(hre as any).ethers);
    console.log("hre.network.ethers present:", !!(hre as any).network?.ethers);
  } catch (dErr) {
    console.warn("Failed to inspect hre object:", dErr);
  }

  if (!ethers) {
    console.log("Attempting to create a network connection to let the plugin attach ethers...");
    try {
      const connection = await hre.network.connect();
      console.log("connection keys:", Object.keys(connection));
      // prefer connection.ethers if available
      const connEthers = (connection as any).ethers;
      if (connEthers) {
        console.log("Using connection.ethers");
        (globalThis as any).__HARDHAT_CONNECTION__ = connection; // for debugging if needed
        // override local ethers reference
        (ethers as any) = connEthers;
      } else {
        console.warn("connection.ethers is not available after connecting. Will fall back to standalone ethers.");
        try {
          await (connection as any).disconnect?.();
        } catch (e) {
          /* ignore */
        }
      }
      // disconnect when the process exits (best-effort)
      process.on("exit", async () => {
        try {
          await (connection as any).disconnect?.();
        } catch (e) {
          /* ignore */
        }
      });
    } catch (connErr) {
      console.error("Failed to create network connection:", connErr);
      process.exit(1);
    }
  }

  // If plugin-provided ethers is available, use it. Otherwise, fall back to standalone ethers + artifact.
  if (ethers) {
    try {
      const ChainAid = await ethers.getContractFactory("ChainAid");
      const contract = await ChainAid.deploy();
      await contract.waitForDeployment();
      console.log("✅ Deployed to:", await contract.getAddress());
    } catch (err) {
      console.error("Deployment failed (plugin ethers):", err instanceof Error ? err.message : err);
      console.error(err);
      process.exitCode = 1;
    }
  } else {
    console.log("Falling back to standalone ethers for deployment...");
    try {
      const artifact = await hre.artifacts.readArtifact("ChainAid");

      const rpcUrl = process.env.SEPOLIA_RPC_URL || (hre.config.networks as any)?.sepolia?.url;
      const pk = process.env.SEPOLIA_PRIVATE_KEY || "";

      if (!rpcUrl) {
        throw new Error("No RPC URL for sepolia found in env or hardhat config (SEPOLIA_RPC_URL)");
      }
      if (!pk) {
        throw new Error("No private key found in env (SEPOLIA_PRIVATE_KEY) for deployment");
      }

      const provider = new ethersLib.JsonRpcProvider(rpcUrl);
      const wallet = new ethersLib.Wallet(pk, provider);
      const factory = new ethersLib.ContractFactory(artifact.abi, artifact.bytecode, wallet);
      const contract = await factory.deploy();
      // ethers v6: contract.deploymentTransaction() returns the transaction response
      const deployTx = (contract as any).deploymentTransaction?.();
      if (deployTx && deployTx.hash) {
        await provider.waitForTransaction(deployTx.hash);
      }
      const deployedAddress = (contract as any).target ?? (contract as any).address ?? (contract as any).deployment?.address;
      console.log("✅ Deployed to:", deployedAddress);
    } catch (err) {
      console.error("Deployment failed (standalone ethers):", err instanceof Error ? err.message : err);
      console.error(err);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exitCode = 1;
});
