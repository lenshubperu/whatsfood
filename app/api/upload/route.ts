import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const businessId = formData.get("businessId") as string;

  if (!file || !businessId) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // 🔥 convertir a webp
  const webp = await sharp(buffer)
    .resize(800)
    .webp({ quality: 80 })
    .toBuffer();

  const filename = `${Date.now()}.webp`;
  const key = `products/${businessId}/${filename}`;

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: webp,
      ContentType: "image/webp",
    })
  );

  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  return Response.json({ url });
}