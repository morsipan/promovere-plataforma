import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Solo listamos los nombres de las variables de entorno para depuración segura (sin exponer secretos)
  const envKeys = Object.keys(process.env).sort();
  const blobKeys = envKeys.filter((k) =>
    k.includes('BLOB') || k.includes('S3') || k.includes('STORAGE') || k.includes('TOKEN')
  );

  return NextResponse.json({
    totalKeys: envKeys.length,
    blobOrStorageKeys: blobKeys,
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
  });
}
