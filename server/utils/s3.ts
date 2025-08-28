import { S3Client } from '@aws-sdk/client-s3'

export function getS3Client() {
  const cfg = useRuntimeConfig().doSpaces
  return new S3Client({
    region: cfg.region,
    endpoint: cfg.endpoint,      // DigitalOcean Spaces endpoint
    forcePathStyle: false,       // use virtual-hosted-style
    credentials: { accessKeyId: cfg.key, secretAccessKey: cfg.secret }
  })
}
