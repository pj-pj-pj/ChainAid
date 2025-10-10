// "use client";

// import dynamic from "next/dynamic";
// import { type ReactNode } from "react";

// // Dynamically import Farcaster components with no SSR
// const FarcasterToastManager = dynamic(
//   () => import("./FarcasterToastManager").then((mod) => mod.default),
//   { ssr: false }
// );

// const FarcasterManifestSigner = dynamic(
//   () => import("./FarcasterManifestSigner").then((mod) => mod.default),
//   { ssr: false }
// );

// /**
//  * FarcasterWrapper
//  *
//  * Client-side wrapper that dynamically loads Farcaster-specific components
//  * (toast manager and manifest signer) to ensure they only run in the browser.
//  *
//  * This component wraps the app's children and provides Farcaster mini-app
//  * functionality without affecting server-side rendering.
//  */
// export function FarcasterWrapper({ children }: { children: ReactNode }) {
//   return (
//     <>
//       {children}
//       {/* Toast manager for Farcaster manifest signing feedback */}
//       <FarcasterToastManager>
//         {({ onManifestSuccess, onManifestError }) => (
//           /* Manifest signer handles automatic signing in Farcaster context */
//           <FarcasterManifestSigner
//             onSuccess={onManifestSuccess}
//             onError={onManifestError}
//           />
//         )}
//       </FarcasterToastManager>
//     </>
//   );
// }
