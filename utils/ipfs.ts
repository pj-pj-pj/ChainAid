import { NFTStorage, File as NFTFile } from "nft.storage";

// For demo purposes, using a placeholder API key
// In production, this should be stored securely and accessed via API route
const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQxNjhiODgyRjY3YjMzNzU1ODI4MzRmNDJjOTVmOGNmQzMyY0U4YzQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNTU2MjQwMDAwMCwibmFtZSI6ImRlbW8ta2V5In0.demo";

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  cid: string;
  url: string;
  size: number;
}

/**
 * Upload a file to IPFS via NFT.Storage
 */
export async function uploadToIPFS(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Convert browser File to NFT.Storage File
    const buffer = await file.arrayBuffer();
    const nftFile = new NFTFile([buffer], file.name, { type: file.type });

    // Track upload progress if callback provided
    let uploadedBytes = 0;
    const totalBytes = file.size;

    if (onProgress) {
      const progressInterval = setInterval(() => {
        uploadedBytes = Math.min(uploadedBytes + totalBytes / 10, totalBytes);
        onProgress({
          loaded: uploadedBytes,
          total: totalBytes,
          percentage: (uploadedBytes / totalBytes) * 100,
        });
      }, 200);

      const cid = await client.storeBlob(nftFile);
      clearInterval(progressInterval);

      // Final progress update
      onProgress({
        loaded: totalBytes,
        total: totalBytes,
        percentage: 100,
      });

      return {
        cid,
        url: `https://nftstorage.link/ipfs/${cid}`,
        size: file.size,
      };
    }

    const cid = await client.storeBlob(nftFile);

    return {
      cid,
      url: `https://nftstorage.link/ipfs/${cid}`,
      size: file.size,
    };
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Upload multiple files to IPFS
 */
export async function uploadMultipleToIPFS(
  files: File[],
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadToIPFS(
      file,
      onProgress
        ? (progress: UploadProgress) => onProgress(i, progress)
        : undefined
    );
    results.push(result);
  }

  return results;
}

/**
 * Get IPFS URL from CID
 */
export function getIPFSUrl(cid: string): string {
  return `https://nftstorage.link/ipfs/${cid}`;
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Allowed file types for receipts and documents
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        "File type not supported. Please upload images, PDFs, or documents.",
    };
  }

  return { valid: true };
}
