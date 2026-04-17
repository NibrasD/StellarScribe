/**
 * IPFS Service using Pinata
 * Uploads markdown content to IPFS to persist text data off-chain.
 */

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export async function uploadToIPFS(content: string, title?: string): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT is not configured in .env");
  }

  // Create a blob from the markdown content
  const blob = new Blob([content], { type: 'text/markdown' });
  const data = new FormData();
  
  // Format the filename for Pinata visualization
  const filename = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md` : 'article.md';
  data.append('file', blob, filename);

  // Optional: add some pinata metadata
  const metadata = JSON.stringify({
    name: `StellarScribe Article: ${title || 'Untitled'}`,
  });
  data.append('pinataMetadata', metadata);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: data,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to upload to IPFS: ${res.status} - ${errorBody}`);
  }

  const resData = await res.json();
  // Pinata returns the CID as 'IpfsHash'
  return resData.IpfsHash;
}

/**
 * Helper to get the public gateway URL for an IPFS CID
 */
export function getIPFSGatewayUrl(cid: string): string {
  // Using Pinata's public gateway or standard ipfs.io
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
