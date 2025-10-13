// app/api/files/route.ts
import { NextResponse } from "next/server";
import PinataSDK from "@pinata/sdk";

const jwt = process.env.PINATA_JWT || "";
const apiKey = process.env.PINATA_API_KEY || "";
const apiSecret = process.env.PINATA_API_SECRET || "";

// Prefer JWT if available
const pinata = jwt
  ? new PinataSDK({ jwt } as any)
  : new PinataSDK(apiKey, apiSecret);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Convert browser File -> Buffer -> Readable stream for pinata-sdk
    const ab = await file.arrayBuffer();
    const buffer = Buffer.from(ab);
    const { Readable } = await import("stream");

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: { name: file.name || "upload" },
      pinataOptions: { cidVersion: 1 },
    });

    // result.IpfsHash is the CID
    const cid = result.IpfsHash;
    // Use your Pinata gateway subdomain if set, otherwise the default gateway
    const gatewayHost =
      process.env.NEXT_PUBLIC_GATEWAY_URL || "gateway.pinata.cloud";
    const url = `https://${gatewayHost}/ipfs/${cid}`;

    return NextResponse.json({ cid, url });
  } catch (err: any) {
    console.error("Pinata upload error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
