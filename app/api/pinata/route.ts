import { NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_JWT!,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Upload JSON metadata to IPFS
    const result = await pinata.pinJSONToIPFS(data);

    return NextResponse.json({ cid: result.IpfsHash });
  } catch (err: any) {
    console.error("Pinata upload failed:", err);
    return NextResponse.json(
      { error: "Failed to upload to IPFS" },
      { status: 500 }
    );
  }
}
