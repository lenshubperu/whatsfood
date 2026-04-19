import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const businessId = formData.get("businessId") as string;

    if (!file || !businessId) {
      return Response.json(
        { error: "Missing file or businessId" },
        { status: 400 }
      );
    }

    // 🔥 convertir a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔥 convertir a webp (optimizado)
    const webp = await sharp(buffer)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    // 🔥 nombre único REAL (evita colisiones)
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.webp`;

    const key = `products/${businessId}/${filename}`;

    // 🔥 cliente R2
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    // 🔥 subir a R2
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: webp,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable", // 🚀 CDN pro
      })
    );

    // 🔥 URL FINAL (CDN)
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;

    return Response.json({ url });
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      { error: "Upload failed", detail: error.message },
      { status: 500 }
    );
  }
}